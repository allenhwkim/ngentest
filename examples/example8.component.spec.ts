// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { Example8Component } from './example8.component';
import { Service81 } from './one.service';
import { ServiceThree } from './my-components';
import { ServiceFive } from '@ngx-serviceFive/core';
import { Service82 } from './two.service';
import { ServiceEleven } from '../framework/navigation.service';
import { Router } from '@angular/router';

@Injectable()
class MockService81 {}

@Injectable()
class MockServiceThree {}

@Injectable()
class MockService82 {}

@Injectable()
class MockServiceEleven {}

@Injectable()
class MockRouter {
  navigate() {};
}

@Directive({ selector: '[oneviewPermitted]' })
class OneviewPermittedDirective {
  @Input() oneviewPermitted;
}

@Pipe({name: 'translate'})
class TranslatePipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({name: 'phoneNumber'})
class PhoneNumberPipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({name: 'safeHtml'})
class SafeHtmlPipe implements PipeTransform {
  transform(value) { return value; }
}

describe('Example8Component', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        Example8Component,
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        OneviewPermittedDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Service81, useClass: MockService81 },
        { provide: ServiceThree, useClass: MockServiceThree },
        ServiceFive,
        { provide: Service82, useClass: MockService82 },
        { provide: ServiceEleven, useClass: MockServiceEleven },
        { provide: Router, useClass: MockRouter }
      ]
    }).overrideComponent(Example8Component, {

    }).compileComponents();
    fixture = TestBed.createComponent(Example8Component);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.service81 = component.service81 || {};
    component.service81.getSmade = jest.fn().mockReturnValue(observableOf({}));
    component.data = component.data || {};
    component.data.0 = '0';
    component.data.1 = '1';
    await component.ngOnInit();
    // expect(component.service81.getSmade).toHaveBeenCalled();
  });

  it('should run #resetVa()', async () => {

    component.resetVa({});

  });

  it('should run #realfis()', async () => {
    component.resetVa = jest.fn();
    component.realfis();
    // expect(component.resetVa).toHaveBeenCalled();
  });

  it('should run #seplch()', async () => {
    component.realfis = jest.fn();
    component.service81 = component.service81 || {};
    component.service81.getWipode = jest.fn().mockReturnValue(observableOf({}));
    component.service81.getReads = jest.fn().mockReturnValue(observableOf({}));
    component.setAdtynbis = jest.fn();
    await component.seplch({});
    // expect(component.realfis).toHaveBeenCalled();
    // expect(component.service81.getWipode).toHaveBeenCalled();
    // expect(component.service81.getReads).toHaveBeenCalled();
    // expect(component.setAdtynbis).toHaveBeenCalled();
  });

  it('should run #setAdtynbis()', async () => {
    component.service81 = component.service81 || {};
    component.service81.getAdTys = jest.fn().mockReturnValue(observableOf({}));
    component.service81.loadBbbUuuu = jest.fn().mockReturnValue(observableOf({}));
    await component.setAdtynbis();
    // expect(component.service81.getAdTys).toHaveBeenCalled();
    // expect(component.service81.loadBbbUuuu).toHaveBeenCalled();
  });

  it('should run #adTyChd()', async () => {
    component.resetVa = jest.fn();
    component.adTyChd({
      code: {}
    });
    // expect(component.resetVa).toHaveBeenCalled();
  });

  it('should run #biCyCh()', async () => {
    component.resetVa = jest.fn();
    component.setCh = jest.fn();
    component.service81 = component.service81 || {};
    component.service81.getAdsDeCmDes = jest.fn().mockReturnValue(observableOf({}));
    await component.biCyCh({});
    // expect(component.resetVa).toHaveBeenCalled();
    // expect(component.setCh).toHaveBeenCalled();
    // expect(component.service81.getAdsDeCmDes).toHaveBeenCalled();
  });

  it('should run #setCh()', async () => {
    component.service81 = component.service81 || {};
    component.service81.getAdsChs = jest.fn().mockReturnValue(observableOf({}));
    component.openFoo = jest.fn();
    await component.setCh();
    // expect(component.service81.getAdsChs).toHaveBeenCalled();
    // expect(component.openFoo).toHaveBeenCalled();
  });

  it('should run #handleChSe()', async () => {

    await component.handleChSe({});

  });

  it('should run #handleIsCh()', async () => {

    await component.handleIsCh({
      isSed: {
        auAd: {}
      },
      newInEnd: {},
      isOpOrCld: {}
    });

  });

  it('should run #showAdFo()', async () => {

    component.showAdFo();

  });

  it('should run #foSu()', async () => {
    component.service82 = component.service82 || {};
    component.service82.setDaNCrIn = jest.fn().mockReturnValue(observableOf({}));
    component.opInRSuMo = jest.fn();
    component.submitCrMg = jest.fn();
    await component.foSu({});
    // expect(component.service82.setDaNCrIn).toHaveBeenCalled();
    // expect(component.opInRSuMo).toHaveBeenCalled();
    // expect(component.submitCrMg).toHaveBeenCalled();
  });

  it('should run #submitCrMg()', async () => {
    component.service82 = component.service82 || {};
    component.service82.setSeAdNBiDt = jest.fn();
    component.service82.setChDt = jest.fn();
    component.service82.setIsDt = jest.fn();
    component.service82.setFrDt = jest.fn();
    component.service82.submitCrMg = jest.fn().mockReturnValue(observableOf({}));
    component.opInRSuMo = jest.fn();
    component.openFoo = jest.fn();
    await component.submitCrMg({});
    // expect(component.service82.setSeAdNBiDt).toHaveBeenCalled();
    // expect(component.service82.setChDt).toHaveBeenCalled();
    // expect(component.service82.setIsDt).toHaveBeenCalled();
    // expect(component.service82.setFrDt).toHaveBeenCalled();
    // expect(component.service82.submitCrMg).toHaveBeenCalled();
    // expect(component.opInRSuMo).toHaveBeenCalled();
    // expect(component.openFoo).toHaveBeenCalled();
  });

  it('should run #opInRSuMo()', async () => {
    component.serviceThree = component.serviceThree || {};
    component.serviceThree.open = jest.fn().mockReturnValue({
      dnCld: observableOf({})
    });
    component.serviceThree.close = jest.fn();
    component.sead = component.sead || {};
    component.sead.name = 'name';
    component.router = component.router || {};
    component.router.nvByUr = jest.fn();
    component.navigation = component.navigation || {};
    component.navigation.pvUr = 'pvUr';
    component.opInRSuMo({}, {
      adAm: {}
    });
    // expect(component.serviceThree.open).toHaveBeenCalled();
    // expect(component.serviceThree.close).toHaveBeenCalled();
    // expect(component.router.nvByUr).toHaveBeenCalled();
  });

  it('should run #openFoo()', async () => {
    component.serviceFive = component.serviceFive || {};
    component.serviceFive.instant = jest.fn();
    component.serviceThree = component.serviceThree || {};
    component.serviceThree.open = jest.fn();
    component.openFoo({}, {}, {});
    // expect(component.serviceFive.instant).toHaveBeenCalled();
    // expect(component.serviceThree.open).toHaveBeenCalled();
  });

});
