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

@Injectable()
class MockTranslateService {
  translate = jest.fn();
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
        { provide: TranslateService, useClass: MockTranslateService }
      ]
    }).overrideComponent(TotalDataDetailsComponent, {

      set: { providers: [{ provide: SuspendCtnService, useClass: MockSuspendCtnService }] }

    }).compileComponents();
    fixture = TestBed.createComponent(TotalDataDetailsComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #getBonusDataListForSharing()', async () => {

    component.getBonusDataListForSharing({
      body: {
        dataPurchaseList: [{
          size: '[object Object]'
        }]
      }
    });

  });

  it('should run #getPastUsage()', async () => {

    component.getPastUsage([{
      shared_bundles: {
        shared_bundle: [{}]
      },
      issue_date: '[object Object]'
    }], {});

  });

  it('should run #funcParamAsArray()', async () => {

    component.funcParamAsArray([{
      foo: {
        bar: {
          baz: '[object Object]'
        }
      }
    }, {
      a: {
        b: {
          c: '[object Object]'
        }
      }
    }]);

  });

  it('should run #funcParamAsObject()', async () => {

    component.funcParamAsObject(observableOf({
      param3: {
        foo: {
          bar: {
            baz: '[object Object]'
          }
        }
      },
      param4: {
        a: {
          b: {
            c: '[object Object]'
          }
        }
      }
    }));

  });

  it('should run #funcParamAsCombined()', async () => {

    component.funcParamAsCombined(observableOf({
      foo: {
        bar: {
          baz: '[object Object]'
        }
      }
    }, {
      a: {
        b: {
          c: '[object Object]'
        }
      }
    }, {
      param3: {
        x: {
          y: {
            z: '[object Object]'
          }
        }
      },
      param4: {
        one: {
          two: {
            three: '[object Object]'
          }
        }
      }
    }));

  });

});
