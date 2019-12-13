// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { TotalDataDetailsComponent } from './example9.component';
import { ServiceFive } from '@ngx-serviceFive/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DataManagerService } from '../data-manager.service';
import { EncryptionService } from '@rogers/oneview-components';

@Injectable()
class MockHttpClient {
  post() {};
}

@Injectable()
class MockDataManagerService {}

@Injectable()
class MockEncryptionService {
  decrypt = function() {};
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

describe('TotalDataDetailsComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        TotalDataDetailsComponent,
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        OneviewPermittedDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        ServiceFive,
        { provide: HttpClient, useClass: MockHttpClient },
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
        { provide: DataManagerService, useClass: MockDataManagerService },
        { provide: EncryptionService, useClass: MockEncryptionService }
      ]
    }).overrideComponent(TotalDataDetailsComponent, {

      set: { providers: [{ provide: SuspendcccService, useClass: MockSuspendcccService }] }    
    }).compileComponents();
    fixture = TestBed.createComponent(TotalDataDetailsComponent);
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
    component.ssssMmmm = component.ssssMmmm || {};
    component.ssssMmmm.subList = [
      {
        "shareEverything": {
          "isSharingData": {}
        }
      }
    ];
    component.service8 = component.service8 || {};
    component.service8.ssssMmmm = {
      subList: [{
        shareEverything: {
          isPrimaryccc: {}
        },
        numSxFoo: {}
      }]
    };
    component.getPastUsage1 = jest.fn().mockReturnValue({
      cccDataUsed: {},
      dates: {}
    });
    component.getPastUsage2 = jest.fn().mockReturnValue([
      "cccDataUsed2",
      "dates2"
    ]);
    component.getPastUsage3 = jest.fn();
    component.ngOnInit();
    // expect(component.getPastUsage1).toHaveBeenCalled();
    // expect(component.getPastUsage2).toHaveBeenCalled();
    // expect(component.getPastUsage3).toHaveBeenCalled();
  });

  it('should run #getPrimaryccc()', async () => {
    component.service8 = component.service8 || {};
    component.service8.ssssMmmm = {
      subList: [{
        shareEverything: {
          isPrimaryccc: {}
        },
        numSxFoo: {}
      }]
    };
    component.getPrimaryccc({
      featureGroupList: observableOf({
        featureGroup: {
          label: {
            en: {}
          }
        }
      })
    });

  });

  it('should run #openErrorserviceThree()', async () => {
    component.serviceThree = component.serviceThree || {};
    component.serviceThree.open = jest.fn().mockReturnValue({
      serviceThreeOutput: {}
    });
    component.serviceFive = component.serviceFive || {};
    component.serviceFive.instant = jest.fn();
    component.openErrorserviceThree({}, {});
    // expect(component.serviceThree.open).toHaveBeenCalled();
    // expect(component.serviceFive.instant).toHaveBeenCalled();
  });

  it('should run #getWirelessDetails()', async () => {
    component.getPostPaidDetails = jest.fn();
    component.getCurrentSubsidy = jest.fn();
    component.getWirelessDetails();
    // expect(component.getPostPaidDetails).toHaveBeenCalled();
    // expect(component.getCurrentSubsidy).toHaveBeenCalled();
  });

  it('should run #getBonusDataListForSharing()', async () => {
    component.data = component.data || {};
    component.data.ccc = 'ccc';
    component.getBonusDataListForSharing({}, {
      data: {
        secccList: [{}]
      }
    });

  });

  it('should run #getPastUsage()', async () => {

    component.getPastUsage([{
      shared_bundles: {
        shared_bundle: [{}]
      },
      issue_date: {}
    }], {});

  });

  it('should run #funcParamAsArray()', async () => {

    component.funcParamAsArray([{
      foo: {
        bar: {
          baz: {}
        }
      }
    }, {
      a: {
        b: {
          c: {}
        }
      }
    }]);

  });

  it('should run #funcParamAsObject()', async () => {

    component.funcParamAsObject(observableOf({
      param3: {
        foo: {
          bar: {
            baz: {}
          }
        }
      },
      param4: {
        a: {
          b: {
            c: {}
          }
        }
      }
    }));

  });

  it('should run #funcParamAsCombined()', async () => {

    component.funcParamAsCombined(observableOf({
      foo: {
        bar: {
          baz: {}
        }
      }
    }, {
      a: {
        b: {
          c: {}
        }
      }
    }, {
      param3: {
        x: {
          y: {
            z: {}
          }
        }
      },
      param4: {
        one: {
          two: {
            three: {}
          }
        }
      }
    }));

  });

});
