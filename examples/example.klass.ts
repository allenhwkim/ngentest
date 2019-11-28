import {HTMLCustomElement} from 'html-custom-element';

import * as template from './agent-info.html';
import { loadingImage } from './agent-loading';

import { isPermitted, post, applyPermissions } from '../util';

const validateUrl = '/web/totes/api/v1/oneView/dealerProfile';
const updateUrl = '/web/totes/api/v1/userPreferenceUpdate';
const saveUrl = '/web/totes/api/v1/oneView/saveDealerCode';
const permissionResource = 'DealerCode';
const permissionAction = 'update';

/**
 * Custom Element to display username and change dealer flyout.
 * It is expected of application to handle following events to provide cart details and checkout process.
 * <br/><br/>
 * [Demo](../components/AgentInfoComponent.html)
 */
export class AgentInfo extends HTMLCustomElement {
  /** For which application are you using this element? 'care' or 'retail' */
  for: any;
  /** Flag to enable change dealer code flyout. Default: false*/
  enableChangeDealerCode: boolean = false;
  /** Key value pair for English and French */
  i18n: any;
  /** Response of session agent API, username is extracted from this. */
  agentInfo: any;
  /** Pass RAM permission data */
  ramPermission: any;
  /** @ignore */
  loadingImageSrc: String = loadingImage;
  /** Pass User Preferences data */
  userPreferences: any;

  /** @ignore */
  get username() {
    return this.for === 'care' ?
    this.agentInfo.lanId.replace('.', ' ') :
    `${this.agentInfo.cfaFirstName} ${this.agentInfo.cfaLastName}`;
  }

  /** @ignore */
  connectedCallback() {
    const agentFooterEl: any = this.closest('agent-footer');
    if (agentFooterEl) {
      this.agentInfo = agentFooterEl.agentInfo;
      this.i18n = agentFooterEl.i18n.agentInfo;
      this.ramPermission = agentFooterEl.ramPermission;
      this.userPreferences = agentFooterEl.userPreferences;
      this.enableChangeDealerCode = agentFooterEl.enableChangeDealerCode;
    }

    super.renderWith(template).then(_ => {
      this.renderForCare();
      this.attachListeners();
      applyPermissions.bind(this)().forEach(obj => {
        // change dealer code to be clickable
        if (obj.element.classList.contains('dealer-code') && obj.permitted) {
          const userEl = obj.element.closest('.user');
          if (userEl) { userEl.classList.add('clickable'); }
        } // hide '^' when change dealer code is not enabled
        if (obj.element.classList.contains('rui-icon-chevron-up') && !this.enableChangeDealerCode) {
          obj.element.style.display = 'none';
        }
      });
    });
  }

  closeAgentDealerChange(event) {
    this.classList.remove('visible');
  }

  /**
  * Performs rule related for extracting dealer code from AgentInfo and UserPreferences. Also calls Save dealer code API if required.
  * @param agentInfo Response of Session Agent API
  * @param userPreferences Response of Retrieve User Preferences API
  */
  applyDealerCode(agentInfo, userPreferences) {
    if (agentInfo && userPreferences) {
      const dealerCodeInAgent = agentInfo.dealerCode;
      this.userPreferences = userPreferences;
      let dealerCodeInUserPref;
      let dealerObj;
      if (userPreferences.userPreference) {
        dealerObj = userPreferences.userPreference.filter(data => data.name === 'dealerCode');
      }
      if (dealerObj && dealerObj.length > 0) { dealerCodeInUserPref = dealerObj[0].value; }

      if (dealerCodeInAgent && dealerCodeInUserPref && (dealerCodeInAgent === dealerCodeInUserPref)) {
        this.setDealerCode(dealerCodeInAgent);
      } else if (!dealerCodeInAgent && !dealerCodeInUserPref) {
        this.setDealerCode(this.i18n.noCode);
        this.querySelector('.current-dealer-wrap').classList.add('edit');
      } else if (dealerCodeInAgent && dealerCodeInAgent !== dealerCodeInUserPref) {
        this.setDealerCode(`${dealerCodeInAgent} (${this.i18n.acting})`, false);
      } else if (!dealerCodeInAgent && dealerCodeInUserPref) {
        this.setDealerCode(dealerCodeInUserPref);
        const accountNumber = agentInfo.consumer && agentInfo.consumer.accountNumber;
        const data = {'dealerCode': dealerCodeInUserPref, 'acctNbr': accountNumber};
        this.saveDealerCode(data);
      }
    }
  }

  /** @ignore */
  renderForCare() {
    this.applyDealerCode(this.agentInfo, this.userPreferences);
    const selector = this.for === 'care' ? '.retail-only' : '.care-only';
    const elsToRemove = this.querySelectorAll(selector);
    Array.from(elsToRemove).forEach(el => el.remove());
  }

  /** @ignore */
  // isCurrent means that it's agent's own dealer code and s/he is not impersonating (working on behalf of someone else)
  setDealerCode(dealerCode, isCurrent = true) {
    Array.from(this.querySelectorAll('.dealer-code')).forEach(el => {
      el.innerHTML = dealerCode;
    });
    if (isCurrent && this.querySelector('.current-dealer-code')) {
      this.querySelector('.current-dealer-code').innerHTML = dealerCode;
    }
  }

  /** @ignore */
  toggleChangeDealer(event: Event) {
    if (!this.userPreferences || !this.enableChangeDealerCode) { return; }
    this.classList.toggle('visible');
  }

  /** @ignore */
  attachListeners() {
    Array.from(document.querySelectorAll('.text-field input'))
      .forEach(t => {
        const parent = t.parentElement;
        const container = this.querySelector('.' + t.id + '-container');
        const button = this.querySelector('.' + t.id + '-container button');

        parent.classList.add('empty');
        t.addEventListener('focus', _ => parent.classList.add('active'));
        t.addEventListener('blur', _ => parent.classList.remove('active'));
        t.addEventListener('input', e => {
          const target = <HTMLInputElement> e. target;
          if (target.value) { parent.classList.remove('empty'); }

          if (target.validity.valid) {
            container.classList.add('valid');
            button.removeAttribute('disabled');
          } else {
            container.classList.remove('valid');
            button.setAttribute('disabled', 'disabled');
          }
        });
      });
  }

  /** @ignore */
  toggleChangeDealerForm() {
    this.querySelector('.current-dealer-wrap').classList.toggle('edit');
  }

  /** @ignore */
  validateDealerCode(data) {
    return post.bind(this)(validateUrl, data)
      .then(resp => {
        if (!resp || !resp.success) { throw new Error('Invalid dealer code'); } // TODO update message and translate
        return resp.success;
      });
  }

  /** @ignore */
  updateSession(data) {
    return post.bind(this)(updateUrl, data, 'text/html')
      .then(resp => {
        if (resp === '"success"' || resp === 'success') {
          return true;
        } else {
          throw new Error('Update failed'); // TODO update message and translate
        }
      });
  }

  /** @ignore */
  saveDealerCode(data) {
    return post.bind(this)(saveUrl, data, 'text/html')
      .then(resp => {
        if (resp === '"Succeeded"' || resp === 'Succeeded') {
          return true;
        } else {
          throw new Error('Save failed'); // TODO update message and translate
        }
      });
  }

  /** @ignore */
  updateDealer(event) {
    const impDealerCode = (<HTMLInputElement> this.querySelector('.current-dealer-txt input')).value;
    const accountNumber = this.agentInfo.consumer && this.agentInfo.consumer.accountNumber;
    const data4Validate = {dealerID: impDealerCode};
    const data4Update = {
      'userId': this.agentInfo.lanId,
      'userType': 'care',
      'userPreferenceName': 'dealerCode',
      'userPreferenceValue': impDealerCode
    };
    const data4Save = {'dealerCode': impDealerCode, 'acctNbr': accountNumber};

    this.querySelector('.current-dealer-wrap').classList.add('loading');

    this.validateDealerCode(data4Validate)
      .then(_ => this.updateSession(data4Update))
      .then(_ => this.saveDealerCode(data4Save))
      .then(_ => {
          this.toggleChangeDealerForm();
          this.querySelector('.current-dealer-wrap').classList.remove('loading');
          this.setDealerCode(impDealerCode);
          (<HTMLInputElement> this.querySelector('.current-dealer-txt input')).value = '';
          this.toggleChangeDealer(event);
      }).catch(error => {
        console.log(error); // TODO update UI, awaiting mock.
      });
  }

  /** @ignore */
  impersonate(event) {
    const impDealerCode = (<HTMLInputElement> this.querySelector('.impersonate-txt input')).value;
    const accountNumber = this.agentInfo.consumer && this.agentInfo.consumer.accountNumber;
    const data4Validate = {dealerID: impDealerCode};
    const data4Save = {'dealerCode': impDealerCode, 'acctNbr': accountNumber};

    this.querySelector('.impersonate-wrap').classList.add('loading');

    this.validateDealerCode(data4Validate)
      .then(_ => this.saveDealerCode(data4Save))
      .then(_ => {
        this.setDealerCode(`${impDealerCode} (${this.i18n.acting})`, false);
        this.querySelector('.impersonate-wrap').classList.remove('loading');
        (<HTMLInputElement> this.querySelector('.impersonate-txt input')).value = '';
        this.toggleChangeDealer(event);
      }).catch(error => {
        console.log(error);
      });
  }
}

AgentInfo.define('agent-info',  AgentInfo);
