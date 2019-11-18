import { async } from '@angular/core/testing';
import {Component} from '@angular/core';
import {ExampleKlass} from './example.klass';

describe('ExampleKlass', () => {
  let obj;

  beforeEach(() => {
    // TODO: Think about is there anything can do with constructor mocks(?), things done within constructor
    obj = new ExampleKlass();
  });

  it('should run #connectedCallback()', async () => {
    obj.closest = jest.fn();
    obj.agentHeaderEl = obj.agentHeaderEl || {};
    obj.agentHeaderEl.i18n = {
      agentCart: '[object Object]'
    };
    obj.renderWith = jest.fn();
    obj.setShoppingCart = jest.fn();
    obj.connectedCallback();
    expect(obj.closest).toHaveBeenCalled();
    expect(obj.renderWith).toHaveBeenCalled();
    expect(obj.setShoppingCart).toHaveBeenCalled();
  });

  it('should run #toggleCart()', async () => {
    obj.dispatchEvent = jest.fn();
    obj.toggleCart({});
    expect(obj.dispatchEvent).toHaveBeenCalled();
  });

  it('should run #cartClicked()', async () => {
    obj.classList = obj.classList || {};
    obj.classList.add = jest.fn();
    obj.cartClicked({});
    expect(obj.classList.add).toHaveBeenCalled();
  });

  it('should run #setShoppingCart()', async () => {
    obj.removeItems = jest.fn();
    obj.querySelector = jest.fn();
    obj.appendItems = jest.fn();
    obj.setShoppingCart({
      ppc: {
        concat : function() {
          return {};
        }
      }
    });
    expect(obj.removeItems).toHaveBeenCalled();
    expect(obj.querySelector).toHaveBeenCalled();
    expect(obj.appendItems).toHaveBeenCalled();
  });

  it('should run #appendItems()', async () => {
    obj.querySelector = jest.fn();
    obj.getQuotationTemplate = jest.fn();
    obj.i18n = obj.i18n || {};
    obj.i18n.myQuotes = 'myQuotes';
    obj.appendItems({
      forEach : function() {
        return ["ngentest"];
      }
    });
    expect(obj.querySelector).toHaveBeenCalled();
    expect(obj.getQuotationTemplate).toHaveBeenCalled();
  });

  it('should run #getQuotationTemplate()', async () => {
    obj.i18n = obj.i18n || {};
    obj.i18n.delete = 'delete';
    obj.i18n = obj.i18n || {};
    obj.i18n.quote = 'quote';
    obj.i18n = obj.i18n || {};
    obj.i18n.expired = 'expired';
    obj.i18n = obj.i18n || {};
    obj.i18n.expires = 'expires';
    obj.getQuotationTemplate({
      quoteExpired: {},
      orderId: '[object Object]'
    }, {});

  });

  it('should run #getOrderTemplate()', async () => {
    obj.i18n = obj.i18n || {};
    obj.i18n.delete = 'delete';
    obj.getOrderTemplate({}, {});

  });

  it('should run #removeItems()', async () => {

    obj.removeItems();

  });

  it('should run #cancelOrder()', async () => {

    obj.cancelOrder({
      stopPropagation : function() {
        return {};
      },
      currentTarget: {
        parentElement: {
          parentElement: '[object Object]'
        }
      }
    });

  });

  it('should run #itemClicked()', async () => {
    obj.cartData = obj.cartData || {};
    obj.cartData.find = jest.fn();
    obj.dispatchEvent = jest.fn();
    obj.classList = obj.classList || {};
    obj.classList.remove = jest.fn();
    obj.itemClicked({
      currentTarget: {
        getAttribute : function() {
          return {};
        }
      }
    });
    expect(obj.cartData.find).toHaveBeenCalled();
    expect(obj.dispatchEvent).toHaveBeenCalled();
    expect(obj.classList.remove).toHaveBeenCalled();
  });

  it('should run #closeShoppingCart()', async () => {
    obj.classList = obj.classList || {};
    obj.classList.remove = jest.fn();
    obj.closeShoppingCart({});
    expect(obj.classList.remove).toHaveBeenCalled();
  });

});
