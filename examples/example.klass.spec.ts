import { async } from '@angular/core/testing';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { AgentInfo } from './example.klass';
describe('AgentInfo', () => {
  let obj;

  beforeEach(() => {
    obj = new AgentInfo();
  });

  it('should run GetterDeclaration #username', async () => {
    obj.bazInfo = obj.bazInfo || {};
    obj.bazInfo.lanId = 'lanId';
    obj.bazInfo.cfaFirstName = 'cfaFirstName';
    obj.bazInfo.cfaLastName = 'cfaLastName';
    const username = obj.username;

  });

  it('should run #connectedCallback()', async () => {
    obj.closest = jest.fn().mockReturnValue({
      enableChangeFooCode: {},
      pppUuuu: {},
      ramPermission: {},
      i18n: {
        bazInfo: {}
      },
      bazInfo: {}
    });
    obj.renderWith = jest.fn().mockReturnValue({
      then: function() {
        return [
          null
        ];
      }
    });
    obj.renderForCare = jest.fn();
    obj.attachListeners = jest.fn();
    obj.connectedCallback();
    // expect(obj.closest).toHaveBeenCalled();
    // expect(obj.renderWith).toHaveBeenCalled();
    // expect(obj.renderForCare).toHaveBeenCalled();
    // expect(obj.attachListeners).toHaveBeenCalled();
  });

  it('should run #closeAgentDealerChange()', async () => {
    obj.classList = obj.classList || {};
    obj.classList.remove = jest.fn();
    obj.closeAgentDealerChange({});
    // expect(obj.classList.remove).toHaveBeenCalled();
  });

  it('should run #applyFooCode()', async () => {
    obj.setFooCode = jest.fn();
    obj.i18n = obj.i18n || {};
    obj.i18n.noCode = 'noCode';
    obj.i18n.acting = 'acting';
    obj.querySelector = jest.fn().mockReturnValue({
      classList: {
        add: function() {}
      }
    });
    obj.saveFooCode = jest.fn();
    obj.applyFooCode({
      fooOneCode: {},
      consumer: {
        nnnAaaa: {}
      }
    }, {
      userPreference: [{
        name: {}
      }]
    });
    // expect(obj.setFooCode).toHaveBeenCalled();
    // expect(obj.querySelector).toHaveBeenCalled();
    // expect(obj.saveFooCode).toHaveBeenCalled();
  });

  it('should run #renderForCare()', async () => {
    obj.applyFooCode = jest.fn();
    obj.querySelectorAll = jest.fn();
    obj.renderForCare();
    // expect(obj.applyFooCode).toHaveBeenCalled();
    // expect(obj.querySelectorAll).toHaveBeenCalled();
  });

  it('should run #setFooCode()', async () => {
    obj.querySelectorAll = jest.fn();
    obj.querySelector = jest.fn().mockReturnValue({
      innerHTML: {}
    });
    obj.setFooCode({});
    // expect(obj.querySelectorAll).toHaveBeenCalled();
    // expect(obj.querySelector).toHaveBeenCalled();
  });

  it('should run #toggleChangeDealer()', async () => {
    obj.classList = obj.classList || {};
    obj.classList.toggle = jest.fn();
    obj.toggleChangeDealer({});
    // expect(obj.classList.toggle).toHaveBeenCalled();
  });

  it('should run #attachListeners()', async () => {
    obj.querySelector = jest.fn().mockReturnValue({
      setAttribute: function() {},
      classList: {
        add: function() {}
      },
      removeAttribute: function() {}
    });
    obj.attachListeners();
    // expect(obj.querySelector).toHaveBeenCalled();
  });

  it('should run #toggleChangeDealerForm()', async () => {
    obj.querySelector = jest.fn().mockReturnValue({
      classList: {
        toggle: function() {}
      }
    });
    obj.toggleChangeDealerForm();
    // expect(obj.querySelector).toHaveBeenCalled();
  });

  it('should run #validateFooCode()', async () => {

    obj.validateFooCode({});

  });

  it('should run #updateSession()', async () => {

    obj.updateSession({});

  });

  it('should run #saveFooCode()', async () => {

    obj.saveFooCode({});

  });

  it('should run #updateDealer()', async () => {
    obj.querySelector = jest.fn().mockReturnValue({
      value: {},
      classList: {
        add: function() {}
      }
    });
    obj.bazInfo = obj.bazInfo || {};
    obj.bazInfo.consumer = {
      nnnAaaa: {}
    };
    obj.bazInfo.lanId = 'lanId';
    obj.validateFooCode = jest.fn().mockReturnValue({
      then: function() {
        return {
          then: function() {
            return {
              then: function() {
                return {
                  catch: function() {
                    return [
                      null
                    ];
                  }
                };
              }
            };
          }
        };
      }
    });
    obj.updateSession = jest.fn();
    obj.saveFooCode = jest.fn();
    obj.toggleChangeDealerForm = jest.fn();
    obj.setFooCode = jest.fn();
    obj.toggleChangeDealer = jest.fn();
    obj.updateDealer({});
    // expect(obj.querySelector).toHaveBeenCalled();
    // expect(obj.validateFooCode).toHaveBeenCalled();
    // expect(obj.updateSession).toHaveBeenCalled();
    // expect(obj.saveFooCode).toHaveBeenCalled();
    // expect(obj.toggleChangeDealerForm).toHaveBeenCalled();
    // expect(obj.setFooCode).toHaveBeenCalled();
    // expect(obj.toggleChangeDealer).toHaveBeenCalled();
  });

  it('should run #impersonate()', async () => {
    obj.querySelector = jest.fn().mockReturnValue({
      value: {},
      classList: {
        add: function() {}
      }
    });
    obj.bazInfo = obj.bazInfo || {};
    obj.bazInfo.consumer = {
      nnnAaaa: {}
    };
    obj.validateFooCode = jest.fn().mockReturnValue({
      then: function() {
        return {
          then: function() {
            return {
              catch: function() {
                return [
                  null
                ];
              }
            };
          }
        };
      }
    });
    obj.saveFooCode = jest.fn();
    obj.setFooCode = jest.fn();
    obj.i18n = obj.i18n || {};
    obj.i18n.acting = 'acting';
    obj.toggleChangeDealer = jest.fn();
    obj.impersonate({});
    // expect(obj.querySelector).toHaveBeenCalled();
    // expect(obj.validateFooCode).toHaveBeenCalled();
    // expect(obj.saveFooCode).toHaveBeenCalled();
    // expect(obj.setFooCode).toHaveBeenCalled();
    // expect(obj.toggleChangeDealer).toHaveBeenCalled();
  });

});
