// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component, ElementRef, LOCALE_ID } from '@angular/core';
import { Example3Component } from './example3.component';
import { ActivatedRoute } from '@angular/router';
import { ServiceThree } from '../../oneview-common/serviceThree/serviceThree.service';
import { ServiceTwo } from './billing-header.service';
import { ServiceOne } from '../payment.service';
import { ServiceFour } from 'src/app/billing/billing-page/billing-data.service';

@Injectable()
class MockElementRef {
  nativeElement = {};
}

@Injectable()
class MockServiceThree {}

@Injectable()
class MockServiceTwo {}

@Injectable()
class MockServiceOne {}

@Injectable()
class MockServiceFour {}

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

describe('Example3Component', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        Example3Component,
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        OneviewPermittedDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {url: 'url', params: {}, queryParams: {}, data: {}},
            url: observableOf('url'),
            params: observableOf({}),
            queryParams: observableOf({}),
            fragment: observableOf('fragment'),
            data: observableOf({})
          }
        },
        { provide: ElementRef, useClass: MockElementRef },
        { provide: ServiceThree, useClass: MockServiceThree },
        { provide: ServiceTwo, useClass: MockServiceTwo },
        { provide: ServiceOne, useClass: MockServiceOne },
        { provide: ServiceFour, useClass: MockServiceFour },
        { provide: 'LOCALE_ID', useValue: 'en' }
      ]
    }).overrideComponent(Example3Component, {

    }).compileComponents();
    fixture = TestBed.createComponent(Example3Component);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run SetterDeclaration #iiiiPppp', async () => {

    component.iiiiPppp = {
      count: {},
      upcomingDate: {},
      myAmount: {}
    };

  });

  it('should run #ngOnInit()', async () => {
    component.route = component.route || {};
    component.route.snapshot = {
      params: {
        'ccc': {}
      }
    };
    component.ssssMmmm = component.ssssMmmm || {};
    component.ssssMmmm.accountStatus = 'accountStatus';
    component.setNnnMmm = jest.fn();
    component.details = component.details || {};
    component.details.OooPppMmm = {
      tttMmm: 'tttMmm'
    };
    component.setCccDddBbb = jest.fn();
    component.setFooDddCcc = jest.fn();
    component.getcccUuu = jest.fn();
    component.isCccLllWwwSssIiii = jest.fn();
    component.serviceOne = component.serviceOne || {};
    component.serviceOne.getfooCardConfig = jest.fn().mockReturnValue(observableOf({}));
    component.serviceFour = component.serviceFour || {};
    component.serviceFour.getFooing = jest.fn().mockReturnValue(observableOf({}));
    component.ngOnInit();
    // expect(component.setNnnMmm).toHaveBeenCalled();
    // expect(component.setCccDddBbb).toHaveBeenCalled();
    // expect(component.setFooDddCcc).toHaveBeenCalled();
    // expect(component.getcccUuu).toHaveBeenCalled();
    // expect(component.isCccLllWwwSssIiii).toHaveBeenCalled();
    // expect(component.serviceOne.getfooCardConfig).toHaveBeenCalled();
    // expect(component.serviceFour.getFooing).toHaveBeenCalled();
  });

  it('should run #setCccDddBbb()', async () => {
    component.details = component.details || {};
    component.details.OooPppMmm = {
      chequingDetails: {
        nnnAaaa: {}
      }
    };
    component.setCccDddBbb();

  });

  it('should run #setFooDddCcc()', async () => {
    component.details = component.details || {};
    component.details.OooPppMmm = {
      fooCardDetails: {
        ccType: {},
        fooBaz: {}
      }
    };
    component.bbbHhh = component.bbbHhh || {};
    component.bbbHhh.getLocalDate = jest.fn();
    component.bbbHhh.formatDate = jest.fn();
    component.bbbHhh.isFooDddCcc = jest.fn();
    component.bbbHhh.isFooEeeCcc = jest.fn();
    component.setFooDddCcc();
    // expect(component.bbbHhh.getLocalDate).toHaveBeenCalled();
    // expect(component.bbbHhh.formatDate).toHaveBeenCalled();
    // expect(component.bbbHhh.isFooDddCcc).toHaveBeenCalled();
    // expect(component.bbbHhh.isFooEeeCcc).toHaveBeenCalled();
  });

  it('should run #openPpppCccc()', async () => {
    component.details = component.details || {};
    component.details.dddDddBbb = 'dddDddBbb';
    component.bbbHhh = component.bbbHhh || {};
    component.bbbHhh.formatDate = jest.fn();
    component.serviceThree = component.serviceThree || {};
    component.serviceThree.open = jest.fn().mockReturnValue({
      $tttCccMmmCcc: observableOf({})
    });
    component.openPpppCccc({});
    // expect(component.bbbHhh.formatDate).toHaveBeenCalled();
    // expect(component.serviceThree.open).toHaveBeenCalled();
  });

  it('should run #openPppSss()', async () => {
    component.el = component.el || {};
    component.el.nativeElement = {
      dispatchEvent: function() {}
    };
    component.openPppSss({
      stopPropagation: function() {}
    });

  });

  it('should run #openPppSssHistory()', async () => {
    component.el = component.el || {};
    component.el.nativeElement = {
      dispatchEvent: function() {}
    };
    component.openPppSssHistory({
      stopPropagation: function() {}
    });

  });

  it('should run #processThisDate()', async () => {

    component.processThisDate({}, {}, {});

  });

  it('should run #setNnnMmm()', async () => {
    component.getStartEndDates = jest.fn().mockReturnValue({
      startDate: {},
      endDate: {}
    });
    component.details = component.details || {};
    component.details.myType = 'myType';
    component.processThisDate = jest.fn();
    component.setNnnMmm();
    // expect(component.getStartEndDates).toHaveBeenCalled();
    // expect(component.processThisDate).toHaveBeenCalled();
  });

  it('should run #getStartEndDates()', async () => {

    component.getStartEndDates({
      startDate: 'startDate',
      endDate: 'endDate'
    });

  });

  it('should run #getcccUuu()', async () => {
    component.details = component.details || {};
    component.details.llllCccc = 'llllCccc';
    component.details.ccccAaaAaaa = 'ccccAaaAaaa';
    component.getcccUuu();

  });

  it('should run #getPpppCcc()', async () => {
    component.getcccUuu = jest.fn();
    component.details = component.details || {};
    component.details.llllCccc = 'llllCccc';
    component.getPpppCcc();
    // expect(component.getcccUuu).toHaveBeenCalled();
  });

  it('should run #isCccLllWwwSssIiii()', async () => {
    component.details = component.details || {};
    component.details.llllCccc = 'llllCccc';
    component.getPpppCcc = jest.fn();
    component.isCccLllWwwSssIiii();
    // expect(component.getPpppCcc).toHaveBeenCalled();
  });

});
