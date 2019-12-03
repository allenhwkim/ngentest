import { async } from '@angular/core/testing';
import { Observable, of as observableOf, throwError } from 'rxjs';

import {Component} from '@angular/core';
import {AgentInfo} from './example.klass';

describe('AgentInfo', () => {
  let obj;

  beforeEach(() => {
    obj = new AgentInfo();
  });

  it('should run GetterDeclaration #username', async () => {
    obj.agentInfo = obj.agentInfo || {};
    obj.agentInfo.lanId = 'lanId';
    obj.agentInfo.cfaFirstName = 'cfaFirstName';
    obj.agentInfo.cfaLastName = 'cfaLastName';
    const username = obj.username;

  });

  it('should run #connectedCallback()', async () => {
    obj.closest = jest.fn();
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
    expect(obj.closest).toHaveBeenCalled();
    expect(obj.renderWith).toHaveBeenCalled();
    expect(obj.renderForCare).toHaveBeenCalled();
    expect(obj.attachListeners).toHaveBeenCalled();
  });

  it('should run #closeAgentDealerChange()', async () => {
    obj.classList = obj.classList || {};
    obj.classList.remove = jest.fn();
    obj.closeAgentDealerChange({});
    expect(obj.classList.remove).toHaveBeenCalled();
  });

  it('should run #applyDealerCode()', async () => {
    obj.setDealerCode = jest.fn();
    obj.i18n = obj.i18n || {};
    obj.i18n.noCode = 'noCode';
    obj.i18n.acting = 'acting';
    obj.querySelector = jest.fn().mockReturnValue({
      classList: {
        add: jest.fn()
      }
    });
    obj.saveDealerCode = jest.fn();
    obj.applyDealerCode({
      dealerCode: {},
      consumer: {
        accountNumber: {}
      }
    }, {
      userPreference: [{
        name: {}
      }]
    });
    expect(obj.setDealerCode).toHaveBeenCalled();
    expect(obj.querySelector).toHaveBeenCalled();
    expect(obj.saveDealerCode).toHaveBeenCalled();
  });

  it('should run #renderForCare()', async () => {
    obj.applyDealerCode = jest.fn();
    obj.querySelectorAll = jest.fn();
    obj.renderForCare();
    expect(obj.applyDealerCode).toHaveBeenCalled();
    expect(obj.querySelectorAll).toHaveBeenCalled();
  });

  it('should run #setDealerCode()', async () => {
    obj.querySelectorAll = jest.fn();
    obj.querySelector = jest.fn().mockReturnValue({
      innerHTML: {}
    });
    obj.setDealerCode({});
    expect(obj.querySelectorAll).toHaveBeenCalled();
    expect(obj.querySelector).toHaveBeenCalled();
  });

  it('should run #toggleChangeDealer()', async () => {
    obj.classList = obj.classList || {};
    obj.classList.toggle = jest.fn();
    obj.toggleChangeDealer({});
    expect(obj.classList.toggle).toHaveBeenCalled();
  });

  it('should run #attachListeners()', async () => {
    obj.querySelector = jest.fn();
    obj.attachListeners();
    expect(obj.querySelector).toHaveBeenCalled();
  });

  it('should run #toggleChangeDealerForm()', async () => {
    obj.querySelector = jest.fn().mockReturnValue({
      classList: {
        toggle: jest.fn()
      }
    });
    obj.toggleChangeDealerForm();
    expect(obj.querySelector).toHaveBeenCalled();
  });

  it('should run #validateDealerCode()', async () => {

    obj.validateDealerCode({});

  });

  it('should run #updateSession()', async () => {

    obj.updateSession({});

  });

  it('should run #saveDealerCode()', async () => {

    obj.saveDealerCode({});

  });

  it('should run #updateDealer()', async () => {
    obj.querySelector = jest.fn().mockReturnValue({
      value: {},
      classList: {
        add: jest.fn()
      }
    });
    obj.agentInfo = obj.agentInfo || {};
    obj.agentInfo.consumer = {
      accountNumber: {}
    };
    obj.agentInfo.lanId = 'lanId';
    obj.validateDealerCode = jest.fn().mockReturnValue({
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
    obj.saveDealerCode = jest.fn();
    obj.toggleChangeDealerForm = jest.fn();
    obj.setDealerCode = jest.fn();
    obj.toggleChangeDealer = jest.fn();
    obj.updateDealer({});
    expect(obj.querySelector).toHaveBeenCalled();
    expect(obj.validateDealerCode).toHaveBeenCalled();
    expect(obj.updateSession).toHaveBeenCalled();
    expect(obj.saveDealerCode).toHaveBeenCalled();
    expect(obj.toggleChangeDealerForm).toHaveBeenCalled();
    expect(obj.setDealerCode).toHaveBeenCalled();
    expect(obj.toggleChangeDealer).toHaveBeenCalled();
  });

  it('should run #impersonate()', async () => {
    obj.querySelector = jest.fn().mockReturnValue({
      value: {},
      classList: {
        add: jest.fn()
      }
    });
    obj.agentInfo = obj.agentInfo || {};
    obj.agentInfo.consumer = {
      accountNumber: {}
    };
    obj.validateDealerCode = jest.fn().mockReturnValue({
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
    obj.saveDealerCode = jest.fn();
    obj.setDealerCode = jest.fn();
    obj.i18n = obj.i18n || {};
    obj.i18n.acting = 'acting';
    obj.toggleChangeDealer = jest.fn();
    obj.impersonate({});
    expect(obj.querySelector).toHaveBeenCalled();
    expect(obj.validateDealerCode).toHaveBeenCalled();
    expect(obj.saveDealerCode).toHaveBeenCalled();
    expect(obj.setDealerCode).toHaveBeenCalled();
    expect(obj.toggleChangeDealer).toHaveBeenCalled();
  });

});
