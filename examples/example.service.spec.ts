import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import {Component} from '@angular/core';
import {DynamicComponentService} from './example.service';

describe('DynamicComponentService', () => {
  let service;

  beforeEach(() => {
    service = new DynamicComponentService({});
  });

  it('should run #createComponent()', async () => {
    service.factoryResolver = service.factoryResolver || {};
    service.factoryResolver.resolveComponentFactory = jest.fn();
    service.createComponent({}, {}, {
      parentInjector: '[object Object]'
    });
    expect(service.factoryResolver.resolveComponentFactory).toHaveBeenCalled();
  });

  it('should run #insertComponent()', async () => {
    service.rootViewContainer = service.rootViewContainer || {};
    service.rootViewContainer.insert = jest.fn();
    service.insertComponent({
      location: {
        nativeElement: {
          setAttribute: jest.fn()
        }
      },
      instance: {
        id: '[object Object]'
      },
      hostView: '[object Object]'
    });
    expect(service.rootViewContainer.insert).toHaveBeenCalled();
  });

  it('should run #emptyFunction()', async () => {

    service.emptyFunction();

  });

});
