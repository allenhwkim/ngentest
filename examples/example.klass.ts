import {HTMLCustomElement} from 'html-custom-element';

import * as template from './my.html';
import { loadingImage } from './loading';

export class ExampleKlass extends HTMLCustomElement {
  for: any;
  i18n: any;
  userInfo: any;
  loadingImageSrc: String = loadingImage;
  pppUuuu: any;

  get username() {
    return this.for === 'care' ?
    this.userInfo.userId.replace('.', ' ') : `${this.userInfo.firstName} ${this.userInfo.lastName}`;
  }

  connectedCallback() {
    const footerEl: any = this.closest('my-footer');
    if (footerEl) {
      this.userInfo = footerEl.userInfo;
      this.i18n = footerEl.i18n.userInfo;
      this.pppUuuu = footerEl.pppUuuu;
    }

    super.renderWith(template).then(_ => {
      this.render();
      this.attachListeners();
    });
  }

  setUserCode(userCode, isCurrent = true) {
    Array.from(this.querySelectorAll('.user-code')).forEach(el => {
      el.innerHTML = userCode;
    });
    if (isCurrent && this.querySelector('.current-user-code')) {
      this.querySelector('.current-user-code').innerHTML = userCode;
    }
  }

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

}

ExampleKlass.define('user-ofni',  ExampleKlass);
