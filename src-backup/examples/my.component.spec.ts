// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { By } from '@angular/platform-browser';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/of';
// import 'rxjs/add/observable/throw';

import {Component, Directive, Inject, PLATFORM_ID} from '@angular/core';
import {AppComponent} from './my.component';
import {AuthGuardService} from './common/app-common.module';
import {CookieService} from './common/services/cookie.service';
import {AppLoadService} from './framework/app-load.service';
import {Router} from '@angular/router';
import {CommonUtilsService} from './common/services/common-utils.service';

@Injectable()
class MockAuthGuardService { }

@Injectable()
class MockCookieService { }

@Injectable()
class MockAppLoadService { }

@Injectable()
class MockRouter { navigate = jest.fn(); }

@Injectable()
class MockCommonUtilsService { }

describe('AppComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [
        {provide: AuthGuardService, useClass: MockAuthGuardService},
        {provide: CookieService, useClass: MockCookieService},
        {provide: AppLoadService, useClass: MockAppLoadService},
        {provide: PLATFORM_ID,useValue: 'browser'},
        {provide: Router, useClass: MockRouter},
        {provide: CommonUtilsService, useClass: MockCommonUtilsService},
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create a component', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    // const result = component.ngOnInit();
  });

  it('should run #logout()', async () => {
    // const result = component.logout();
  });

  it('should run #changeLanguage()', async () => {
    // const result = component.changeLanguage(event);
  });

  it('should run #onDeactivate()', async () => {
    // const result = component.onDeactivate();
  });

  it('should run #changeRoute()', async () => {
    // const result = component.changeRoute(event);
  });

  it('should run #reportIssue()', async () => {
    // const result = component.reportIssue(event);
  });

});
