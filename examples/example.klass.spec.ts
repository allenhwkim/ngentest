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
    obj.renderWith = jest.fn();
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
    obj.querySelector = jest.fn();
    obj.saveDealerCode = jest.fn();
    obj.applyDealerCode({
      dealerCode: '[object Object]',
      consumer: {
        accountNumber: '[object Object]'
      }
    }, {
      userPreference: ['ngentest']
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
    obj.querySelector = jest.fn();
    obj.setDealerCode({});
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
    obj.querySelector = jest.fn();
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
    obj.querySelector = jest.fn();
    obj.agentInfo = obj.agentInfo || {};
    obj.agentInfo.consumer = {
      accountNumber: '[object Object]'
    };
    obj.agentInfo.lanId = 'lanId';
    obj.validateDealerCode = jest.fn();
    obj.updateDealer({});
    expect(obj.querySelector).toHaveBeenCalled();
    expect(obj.validateDealerCode).toHaveBeenCalled();
  });

  it('should run #impersonate()', async () => {
    obj.querySelector = jest.fn();
    obj.agentInfo = obj.agentInfo || {};
    obj.agentInfo.consumer = {
      accountNumber: '[object Object]'
    };
    obj.validateDealerCode = jest.fn();
    obj.impersonate({});
    expect(obj.querySelector).toHaveBeenCalled();
    expect(obj.validateDealerCode).toHaveBeenCalled();
  });

});
