// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component, PLATFORM_ID, Object } from '@angular/core';
import { ExampleComponent } from './example.component';
import { AuthGuardService } from './auth-guard.service';
import { CookieService } from './cookie.service';
import { AppLoadService } from './app-load.service';
import { Router } from '@angular/router';
import { CommonUtilsService } from './common-utils.service';

@Injectable()
class MockAuthGuardService {
  foo = function() {
    return {
      bar: {
        baz : function() {
          return {
            isLoggedIn: {}
          };
        }
      }
    };
  };
}

@Injectable()
class MockCookieService {
  get = function() {
    return {};
  };
  foo = function() {
    return {
      bar: {
        baz : function() {
          return {};
        }
      }
    };
  };
}

@Injectable()
class MockAppLoadService {
  i18n = {
    customElement: {}
  };
}

@Injectable()
class MockRouter {
  route = function() {
    return {
      foo : function() {
        return {
          bar: {}
        };
      }
    };
  };
  navigate = jest.fn();
}

@Injectable()
class MockCommonUtilsService {}
describe('ExampleComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ExampleComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        { provide: AuthGuardService, useClass: MockAuthGuardService },
        { provide: CookieService, useClass: MockCookieService },
        { provide: AppLoadService, useClass: MockAppLoadService },
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: Router, useClass: MockRouter },
        { provide: CommonUtilsService, useClass: MockCommonUtilsService }      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ExampleComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create a component', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.router = component.router || {};
    component.router.events = observableOf({
      urlAfterRedirects: "gentest"
    });
    component.menuEl = component.menuEl || {};
    component.menuEl.nativeElement = {
      highlightMenu : function() {
        return {};
      }
    };
    component.ngOnInit();
  });

  it('should run #logout()', async () => {
    component.authGuardSvc = component.authGuardSvc || {};
    component.authGuardSvc.logoff = jest.fn().mockReturnValue(function() {
      return {};
    });
    component.logout();
  });

  it('should run #changeLanguage()', async () => {
    component.cookie = component.cookie || {};
    component.cookie.get = jest.fn().mockReturnValue(function() {
      return {};
    });
    window.location.reload = jest.fn();
    component.changeLanguage({});
  });

  it('should run #onDeactivate()', async () => {
    window.scrollTo = jest.fn();
    component.onDeactivate();
  });

  it('should run #changeRoute()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn().mockReturnValue(function() {
      return {};
    });
    component.changeRoute({
      detail: "gentest"
    });
  });

  it('should run #reportIssue()', async () => {
    component.commonUtilsSvc = component.commonUtilsSvc || {};
    component.commonUtilsSvc.reportIssue = jest.fn().mockReturnValue(function() {
      return {};
    });
    component.reportIssue({});
  });

});
