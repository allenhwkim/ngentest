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
class MockEncryptionService {}

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

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
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
    expect(component.getPastUsage1).toHaveBeenCalled();
    expect(component.getPastUsage2).toHaveBeenCalled();
    expect(component.getPastUsage3).toHaveBeenCalled();
  });

});
