import { async } from '@angular/core/testing';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { ExampleKlass } from './example.klass';
describe('ExampleKlass', () => {
  let obj;

  beforeEach(() => {
    obj = new ExampleKlass();
  });

  it('should run GetterDeclaration #username', async () => {
    obj.userInfo = obj.userInfo || {};
    obj.userInfo.userId = 'userId';
    obj.userInfo.firstName = 'firstName';
    obj.userInfo.lastName = 'lastName';
    const username = obj.username;

  });

  it('should run #connectedCallback()', async () => {
    obj.closest = jest.fn().mockReturnValue({
      pppUuuu: {},
      i18n: {
        userInfo: {}
      },
      userInfo: {}
    });
    obj.renderWith = jest.fn().mockReturnValue({
      then: function() {
        return [
          null
        ];
      }
    });
    obj.render = jest.fn();
    obj.attachListeners = jest.fn();
    obj.connectedCallback();
    // expect(obj.closest).toHaveBeenCalled();
    // expect(obj.renderWith).toHaveBeenCalled();
    // expect(obj.render).toHaveBeenCalled();
    // expect(obj.attachListeners).toHaveBeenCalled();
  });

  it('should run #setUserCode()', async () => {
    obj.querySelectorAll = jest.fn();
    obj.querySelector = jest.fn().mockReturnValue({
      innerHTML: {}
    });
    obj.setUserCode({});
    // expect(obj.querySelectorAll).toHaveBeenCalled();
    // expect(obj.querySelector).toHaveBeenCalled();
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

});
