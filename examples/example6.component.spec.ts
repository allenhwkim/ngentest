// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { Example6Component } from './example6.component';
import { ServiceThree, ServiceEight } from './my-components';
import { DomSanitizer } from '@angular/platform-browser';
import { ServiceFour } from './four.service';
import { Service61 } from '../sixty-one.service';
import { serviceOne } from '../one.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceEleven } from '../../evleven.service';
import { ServiceFive } from '@ngx-tranalste/core';
import { Service62 } from './sixty-two.service';

@Injectable()
class MockServiceThree {
  open = function() {};
  close = function() {};
}

@Injectable()
class MockServiceFour {
  catchError = function() {
    return observableOf({});
  };
  getFooing = function() {};
  loadBbbUuuu = function() {};
}

@Injectable()
class MockService61 {}

@Injectable()
class MockserviceOne {}

@Injectable()
class MockServiceEight {
  language = {};
  ssssMmmm = {};
}

@Injectable()
class MockRouter {
  navigate() {};
}

@Injectable()
class MockServiceEleven {}

@Injectable()
class MockService62 {
  toshowBarXxx = function() {};
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

describe('Example6Component', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        Example6Component,
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        OneviewPermittedDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ServiceThree, useClass: MockServiceThree },
        DomSanitizer,
        { provide: ServiceFour, useClass: MockServiceFour },
        { provide: Service61, useClass: MockService61 },
        { provide: serviceOne, useClass: MockserviceOne },
        { provide: ServiceEight, useClass: MockServiceEight },
        { provide: Router, useClass: MockRouter },
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
        { provide: ServiceEleven, useClass: MockServiceEleven },
        ServiceFive,
        { provide: Service62, useClass: MockService62 }
      ]
    }).overrideComponent(Example6Component, {

    }).compileComponents();
    fixture = TestBed.createComponent(Example6Component);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run SetterDeclaration #mySelection', async () => {

    component.mySelection = {};

  });

  it('should run GetterDeclaration #mySelection', async () => {

    const mySelection = component.mySelection;

  });

  it('should run #ngOnInit()', async () => {
    component.serviceEleven = component.serviceEleven || {};
    component.serviceEleven.isFffPppRrrr = 'isFffPppRrrr';
    component.router = component.router || {};
    component.router.events = observableOf({});
    component.service64 = component.service64 || {};
    component.service64.getPppIiiAaaa = jest.fn().mockReturnValue(observableOf({
      dddPpp: {
        length: {}
      }
    }));
    component.setbbbHhhPTPMessage = jest.fn();
    component.serviceOne = component.serviceOne || {};
    component.serviceOne.getHhhPppp = jest.fn().mockReturnValue(observableOf({}));
    component.serviceFour = component.serviceFour || {};
    component.serviceFour.getmyConfig = jest.fn().mockReturnValue(observableOf({}));
    component.ngOnInit();
    // expect(component.service64.getPppIiiAaaa).toHaveBeenCalled();
    // expect(component.setbbbHhhPTPMessage).toHaveBeenCalled();
    // expect(component.serviceOne.getHhhPppp).toHaveBeenCalled();
    // expect(component.serviceFour.getmyConfig).toHaveBeenCalled();
  });

  it('should run #getIiiFooPppBar()', async () => {
    component.service64 = component.service64 || {};
    component.service64.getIiiFooPppBar = jest.fn().mockReturnValue(observableOf({
      fooFuz: {
        length: {}
      }
    }));
    component.getIiiFooPppBar({
      detail: {
        PId: {}
      }
    });
    // expect(component.service64.getIiiFooPppBar).toHaveBeenCalled();
  });

  it('should run #setbbbHhhPTPMessage()', async () => {
    component.serviceFour = component.serviceFour || {};
    component.serviceFour.getIdFffHhhP = jest.fn();
    component.service64 = component.service64 || {};
    component.service64.getIiiFooPppBar = jest.fn().mockReturnValue(observableOf({
      fooFuz: {
        length: {}
      }
    }));
    component.setbbbHhhPTPMessage();
    // expect(component.serviceFour.getIdFffHhhP).toHaveBeenCalled();
    // expect(component.service64.getIiiFooPppBar).toHaveBeenCalled();
  });

  it('should run #setTranslations()', async () => {
    component.serviceFour = component.serviceFour || {};
    component.serviceFour.getmyType = jest.fn().mockReturnValue(observableOf({}));
    component.service62 = component.service62 || {};
    component.service62.getCccEchoDtCcc = jest.fn();
    component.mySelection = component.mySelection || {};
    component.mySelection.issue_date = 'issue_date';
    component.serviceFive = component.serviceFive || {};
    component.serviceFive.instant = jest.fn().mockReturnValue('ngentest');
    component.setTranslations();
    // expect(component.serviceFour.getmyType).toHaveBeenCalled();
    // expect(component.service62.getCccEchoDtCcc).toHaveBeenCalled();
    // expect(component.serviceFive.instant).toHaveBeenCalled();
  });

  it('should run #doBbbAaaDddd()', async () => {
    component.serviceThree = component.serviceThree || {};
    component.serviceThree.open = jest.fn();
    component.fetchMee = jest.fn().mockReturnValue(observableOf({}));
    component.doBbbAaaDddd({});
    // expect(component.serviceThree.open).toHaveBeenCalled();
    // expect(component.fetchMee).toHaveBeenCalled();
  });

  it('should run #fetchMee()', async () => {
    component.serviceFour = component.serviceFour || {};
    component.serviceFour.betSssEeeMee = jest.fn().mockReturnValue(observableOf({}));
    component.serviceFour.fetchBar = jest.fn().mockReturnValue(observableOf({}));
    component.serviceFour.doFoo = jest.fn();
    component.mySelection = component.mySelection || {};
    component.mySelection.id = 'id';
    component.mySelection.date = 'date';
    component.serviceThree = component.serviceThree || {};
    component.serviceThree.close = jest.fn();
    component.serviceThree.open = jest.fn();
    component.fetchMee({});
    // expect(component.serviceFour.betSssEeeMee).toHaveBeenCalled();
    // expect(component.serviceFour.fetchBar).toHaveBeenCalled();
    // expect(component.serviceFour.doFoo).toHaveBeenCalled();
    // expect(component.serviceThree.close).toHaveBeenCalled();
    // expect(component.serviceThree.open).toHaveBeenCalled();
  });

  it('should run #printBar()', async () => {
    component.serviceThree = component.serviceThree || {};
    component.serviceThree.open = jest.fn();
    component.serviceThree.close = jest.fn();
    component.serviceFour = component.serviceFour || {};
    component.serviceFour.betSssEeeMee = jest.fn().mockReturnValue(observableOf({}));
    component.serviceFour.resolveMyUrl = jest.fn();
    component.sanitize = component.sanitize || {};
    component.sanitize.bypassSecurityTrustResourceUrl = jest.fn();
    component.mySelection = component.mySelection || {};
    component.mySelection.link = 'link';
    component.printBar();
    // expect(component.serviceThree.open).toHaveBeenCalled();
    // expect(component.serviceThree.close).toHaveBeenCalled();
    // expect(component.serviceFour.betSssEeeMee).toHaveBeenCalled();
    // expect(component.serviceFour.resolveMyUrl).toHaveBeenCalled();
    // expect(component.sanitize.bypassSecurityTrustResourceUrl).toHaveBeenCalled();
  });

  it('should run #saveFoo()', async () => {
    component.serviceThree = component.serviceThree || {};
    component.serviceThree.open = jest.fn();
    component.serviceThree.close = jest.fn();
    component.serviceFour = component.serviceFour || {};
    component.serviceFour.betSssEeeMee = jest.fn().mockReturnValue(observableOf({}));
    component.serviceFour.resolveMyUrl = jest.fn();
    component.mySelection = component.mySelection || {};
    component.mySelection.link = 'link';
    window.open = jest.fn();
    component.saveFoo();
    // expect(component.serviceThree.open).toHaveBeenCalled();
    // expect(component.serviceThree.close).toHaveBeenCalled();
    // expect(component.serviceFour.betSssEeeMee).toHaveBeenCalled();
    // expect(component.serviceFour.resolveMyUrl).toHaveBeenCalled();
    // expect(window.open).toHaveBeenCalled();
  });

  it('should run #setFuz()', async () => {
    component.iFrameBill = component.iFrameBill || {};
    component.iFrameBill.first = {
      nativeElement: {}
    };
    component.iFrameBill.contentDocument = {
      body: {
        scrollHeight: {}
      }
    };
    component.iFrameBill.style = {
      height: {}
    };
    component.setFuz({});

  });

  it('should run #schFooClicked()', async () => {

    component.schFooClicked({});

  });

  it('should run #barSelected()', async () => {
    component.service64 = component.service64 || {};
    component.service64.checkFoo = jest.fn().mockReturnValue(observableOf({
      x: {}
    }));
    component.details = component.details || {};
    component.details.x = 'x';
    component.serviceThree = component.serviceThree || {};
    component.serviceThree.open = jest.fn();
    component.checkTyEl = jest.fn();
    component.openFoo = jest.fn();
    component.barSelected({});
    // expect(component.service64.checkFoo).toHaveBeenCalled();
    // expect(component.serviceThree.open).toHaveBeenCalled();
    // expect(component.checkTyEl).toHaveBeenCalled();
    // expect(component.openFoo).toHaveBeenCalled();
  });

  it('should run #checkTyEl()', async () => {
    component.service64 = component.service64 || {};
    component.service64.checkEeePppMe1 = jest.fn().mockReturnValue(observableOf({
      x: {}
    }));
    component.details = component.details || {};
    component.details.x = 'x';
    component.showBar1 = jest.fn();
    component.serviceThree = component.serviceThree || {};
    component.serviceThree.open = jest.fn();
    component.openFoo = jest.fn();
    component.checkTyEl();
    // expect(component.service64.checkEeePppMe1).toHaveBeenCalled();
    // expect(component.showBar1).toHaveBeenCalled();
    // expect(component.serviceThree.open).toHaveBeenCalled();
    // expect(component.openFoo).toHaveBeenCalled();
  });

  it('should run #showBar1()', async () => {
    component.service64 = component.service64 || {};
    component.service64.getFooLink = jest.fn().mockReturnValue(observableOf({
      x: {
        fr: {},
        en: {}
      }
    }));
    component.service8 = component.service8 || {};
    component.service8.language = 'language';
    component.serviceThree = component.serviceThree || {};
    component.serviceThree.open = jest.fn().mockReturnValue({
      foo$: observableOf({})
    });
    component.details = component.details || {};
    component.details.x = 'x';
    component.saveFuz = jest.fn();
    component.openFoo = jest.fn();
    component.showBar1();
    // expect(component.service64.getFooLink).toHaveBeenCalled();
    // expect(component.serviceThree.open).toHaveBeenCalled();
    // expect(component.saveFuz).toHaveBeenCalled();
    // expect(component.openFoo).toHaveBeenCalled();
  });

  it('should run #saveFuz()', async () => {
    component.serviceFive = component.serviceFive || {};
    component.serviceFive.instant = jest.fn();
    component.service64 = component.service64 || {};
    component.service64.schedulePTP = jest.fn().mockReturnValue(observableOf({
      status: {}
    }));
    component.serviceThree = component.serviceThree || {};
    component.serviceThree.open = jest.fn();
    component.openFoo = jest.fn();
    component.saveFuz({});
    // expect(component.serviceFive.instant).toHaveBeenCalled();
    // expect(component.service64.schedulePTP).toHaveBeenCalled();
    // expect(component.serviceThree.open).toHaveBeenCalled();
    // expect(component.openFoo).toHaveBeenCalled();
  });

  it('should run #openFoo()', async () => {
    component.serviceFive = component.serviceFive || {};
    component.serviceFive.instant = jest.fn();
    component.serviceThree = component.serviceThree || {};
    component.serviceThree.open = jest.fn();
    component.openFoo({});
    // expect(component.serviceFive.instant).toHaveBeenCalled();
    // expect(component.serviceThree.open).toHaveBeenCalled();
  });

  it('should run #handleError()', async () => {

    component.handleError({
      error: {}
    });

  });

});
