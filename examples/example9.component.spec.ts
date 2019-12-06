// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { TotalDataDetailsComponent } from './example9.component';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DataManagerService } from '../data-manager.service';
import { EncryptionService } from '@rogers/oneview-components';

@Injectable()
class MockTranslateService {
  translate = jest.fn();
}

@Injectable()
class MockHttpClient {
  post = jest.fn();
}

@Injectable()
class MockDataManagerService {}

@Injectable()
class MockEncryptionService {
  decrypt = jest.fn();
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
        { provide: TranslateService, useClass: MockTranslateService },
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

      set: { providers: [{ provide: SuspendCtnService, useClass: MockSuspendCtnService }] }

    }).compileComponents();
    fixture = TestBed.createComponent(TotalDataDetailsComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = jest.fn();
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.accountSummary = component.accountSummary || {};
    component.accountSummary.subList = [
      {
        "shareEverything": {
          "isSharingData": {}
        }
      }
    ];
    component.commonData = component.commonData || {};
    component.commonData.accountSummary = {
      subList: [{
        shareEverything: {
          isPrimaryCtn: {}
        },
        subNumber: {}
      }]
    };
    component.getPastUsage1 = jest.fn().mockReturnValue({
      ctnDataUsed: {},
      dates: {}
    });
    component.getPastUsage2 = jest.fn().mockReturnValue([
      "ctnDataUsed2",
      "dates2"
    ]);
    component.getPastUsage3 = jest.fn();
    component.ngOnInit();
    // expect(component.getPastUsage1).toHaveBeenCalled();
    // expect(component.getPastUsage2).toHaveBeenCalled();
    // expect(component.getPastUsage3).toHaveBeenCalled();
  });

  it('should run #getPrimaryCtn()', async () => {
    component.commonData = component.commonData || {};
    component.commonData.accountSummary = {
      subList: [{
        shareEverything: {
          isPrimaryCtn: {}
        },
        subNumber: {}
      }]
    };
    component.getPrimaryCtn({
      featureGroupList: observableOf({
        featureGroup: {
          label: {
            en: {}
          }
        }
      })
    });

  });

  it('should run #openErrorDialog()', async () => {
    component.dialog = component.dialog || {};
    component.dialog.open = jest.fn().mockReturnValue({
      dialogOutput: {}
    });
    component.translate = component.translate || {};
    component.translate.instant = jest.fn();
    component.openErrorDialog({}, {});
    // expect(component.dialog.open).toHaveBeenCalled();
    // expect(component.translate.instant).toHaveBeenCalled();
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
    component.data.ctn = 'ctn';
    component.getBonusDataListForSharing({}, {
      data: {
        seCTNList: [{}]
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
