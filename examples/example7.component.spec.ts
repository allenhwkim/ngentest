// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { Example7Componet } from './example7.component';
import { ServiceThree } from './my-components';
import { Service71 } from './one.service';
import { ServiceEleven } from './eleven.service';

@Injectable()
class MockServiceThree {}

@Injectable()
class MockService71 {}

@Injectable()
class MockServiceEleven {}

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

describe('Example7Componet', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        Example7Componet,
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        OneviewPermittedDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ServiceThree, useClass: MockServiceThree },
        { provide: Service71, useClass: MockService71 },
        { provide: ServiceEleven, useClass: MockServiceEleven }
      ]
    }).overrideComponent(Example7Componet, {

    }).compileComponents();
    fixture = TestBed.createComponent(Example7Componet);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #changePlPr()', async () => {
    component.component3Data = component.component3Data || {};
    component.component3Data.getPx1 = jest.fn();
    component.component3Data.getPpSFuz = jest.fn().mockReturnValue(observableOf({}));
    component.component3Data.checkIfMOS = jest.fn();
    component.component3Data.getFuz = jest.fn();
    component.component3Data.getBarStatus = jest.fn();
    component.component3Data.hasFooAaSubs = jest.fn();
    component.component3Data.getMainSub = jest.fn().mockReturnValue({
      numMainFoo: {}
    });
    component.component3Data.getNumSFooS = jest.fn();
    component.setFooBarFuzData = jest.fn();
    component.getFooData = jest.fn();
    component.getGoodness = jest.fn();
    component.barData = component.barData || {};
    component.barData.numSxFoo = 'numSxFoo';
    component.barData.typeFxFoo = 'typeFxFoo';
    component.fooData = component.fooData || {};
    component.fooData.cccEeeeChecked = 'cccEeeeChecked';
    component.saveFoo = jest.fn();
    await component.changePlPr();
    // expect(component.component3Data.getPx1).toHaveBeenCalled();
    // expect(component.component3Data.getPpSFuz).toHaveBeenCalled();
    // expect(component.component3Data.checkIfMOS).toHaveBeenCalled();
    // expect(component.component3Data.getFuz).toHaveBeenCalled();
    // expect(component.component3Data.getBarStatus).toHaveBeenCalled();
    // expect(component.component3Data.hasFooAaSubs).toHaveBeenCalled();
    // expect(component.component3Data.getMainSub).toHaveBeenCalled();
    // expect(component.component3Data.getNumSFooS).toHaveBeenCalled();
    // expect(component.setFooBarFuzData).toHaveBeenCalled();
    // expect(component.getFooData).toHaveBeenCalled();
    // expect(component.getGoodness).toHaveBeenCalled();
    // expect(component.saveFoo).toHaveBeenCalled();
  });

  it('should run #getGoodness()', async () => {
    component.component3Data = component.component3Data || {};
    component.component3Data.getEeeRrrSss = jest.fn().mockReturnValue(observableOf({}));
    component.component3Data.formatEeeCccEee = jest.fn();
    component.checkBbEeIi = jest.fn();
    component.serviceThree = component.serviceThree || {};
    component.serviceThree.open = jest.fn();
    await component.getGoodness({}, {});
    // expect(component.component3Data.getEeeRrrSss).toHaveBeenCalled();
    // expect(component.component3Data.formatEeeCccEee).toHaveBeenCalled();
    // expect(component.checkBbEeIi).toHaveBeenCalled();
    // expect(component.serviceThree.open).toHaveBeenCalled();
  });

  it('should run #checkBbEeIi()', async () => {
    component.fooData = component.fooData || {};
    component.fooData.ccccAaaAaaa = 'ccccAaaAaaa';
    component.component3Data = component.component3Data || {};
    component.component3Data.getFuz = jest.fn().mockReturnValue(observableOf({}));
    component.component3Data.getPpFuz = jest.fn();
    component.component3Data.cccCcc = jest.fn().mockReturnValue(observableOf({}));
    component.serviceThree = component.serviceThree || {};
    component.serviceThree.open = jest.fn().mockReturnValue({
      saveFoo$: observableOf({})
    });
    component.saveFoo = jest.fn();
    await component.checkBbEeIi({
      ccccAaaAaaa: {}
    });
    // expect(component.component3Data.getFuz).toHaveBeenCalled();
    // expect(component.component3Data.getPpFuz).toHaveBeenCalled();
    // expect(component.component3Data.cccCcc).toHaveBeenCalled();
    // expect(component.serviceThree.open).toHaveBeenCalled();
    // expect(component.saveFoo).toHaveBeenCalled();
  });

  it('should run #saveFoo()', async () => {
    component.component3Data = component.component3Data || {};
    component.component3Data.savePPCState = jest.fn().mockReturnValue(observableOf({}));
    component.navigation = component.navigation || {};
    component.navigation.changeR = jest.fn();
    await component.saveFoo();
    // expect(component.component3Data.savePPCState).toHaveBeenCalled();
    // expect(component.navigation.changeR).toHaveBeenCalled();
  });

  it('should run #getFooData()', async () => {
    component.component3Data = component.component3Data || {};
    component.component3Data.hasAM = jest.fn();
    component.component3Data.hasOivs = jest.fn();
    component.component3Data.etIspd = 'etIspd';
    component.component3Data.getMainSub = jest.fn().mockReturnValue({
      numMainFoo: {}
    });
    component.component3Data.getAasp = jest.fn();
    component.component3Data.getOiiis = jest.fn();
    component.serviceThree = component.serviceThree || {};
    component.serviceThree.open = jest.fn().mockReturnValue({
      createAspwyol: observableOf({
        ccc: {},
        aaaSssSelected: {}
      }),
      makeCtycp$: observableOf({})
    });
    await component.getFooData({}, {});
    // expect(component.component3Data.hasAM).toHaveBeenCalled();
    // expect(component.component3Data.hasOivs).toHaveBeenCalled();
    // expect(component.component3Data.getMainSub).toHaveBeenCalled();
    // expect(component.component3Data.getAasp).toHaveBeenCalled();
    // expect(component.component3Data.getOiiis).toHaveBeenCalled();
    // expect(component.serviceThree.open).toHaveBeenCalled();
  });

  it('should run #setFooBarFuzData()', async () => {
    component.barData = component.barData || {};
    component.barData.x = 'x';
    component.fooData = component.fooData || {};
    component.fooData.x = 'x';
    component.setFooBarFuzData({
      x: {},
      y: {},
      z: {},
      a: {},
      b: {}
    });

  });

});
