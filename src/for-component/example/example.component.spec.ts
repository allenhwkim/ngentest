// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component, PLATFORM_ID } from '@angular/core';
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
            isLoggedIn: '[object Object]'
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
        baz : jest.fn()
      }
    };
  };
}

@Injectable()
class MockAppLoadService {
  i18n = {
    customElement: '[object Object]'
  };
}

@Injectable()
class MockRouter {
  route = function() {
    return {
      foo : function() {
        return {
          bar: '[object Object]'
        };
      }
    };
  };
  navigate = jest.fn();
}

@Injectable()
class MockCommonUtilsService {}

@Pipe({name: 'translate'})
class TranslatePipe implements PipeTransform { 
  transform(value) { return value; } 
}

describe('ExampleComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [ ExampleComponent, TranslatePipe ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: AuthGuardService, useClass: MockAuthGuardService },
        { provide: CookieService, useClass: MockCookieService },
        { provide: AppLoadService, useClass: MockAppLoadService },
        { provide: 'PLATFORM_ID', useValue: 'browser' },
        { provide: Router, useClass: MockRouter },
        { provide: CommonUtilsService, useClass: MockCommonUtilsService }      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ExampleComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.adjustmentsDetailsCms = component.adjustmentsDetailsCms || {};
    component.adjustmentsDetailsCms.location = {
      threshold: '[object Object]'
    };
    component.router = component.router || {};
    component.router.events = {
      subscribe : function() {
        return {
          type: "Observable",
          value: {
            urlAfterRedirects : 'urlAfterRedirects'
          }
        };
      }
    };
    component.menuEl = component.menuEl || {};
    component.menuEl.nativeElement = {
      highlightMenu : jest.fn()
    };
    component.ngOnInit();

  });

  it('should run #logout()', async () => {
    component.authGuardSvc = component.authGuardSvc || {};
    component.authGuardSvc.logoff = jest.fn();
    component.logout();
    expect(component.authGuardSvc.logoff).toHaveBeenCalled();
  });

  it('should run #changeLanguage()', async () => {
    component.cookie = component.cookie || {};
    component.cookie.get = jest.fn();
    window.location.reload = jest.fn();
    component.changeLanguage({});
    expect(component.cookie.get).toHaveBeenCalled();
    expect(window.location.reload).toHaveBeenCalled();
  });

  it('should run #onDeactivate()', async () => {
    window.scrollTo = jest.fn();
    component.onDeactivate();
    expect(window.scrollTo).toHaveBeenCalled();
  });

  it('should run #changeRoute()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.changeRoute({
      detail : 'detail'
    });
    expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #reportIssue()', async () => {
    component.commonUtilsSvc = component.commonUtilsSvc || {};
    component.commonUtilsSvc.reportIssue = jest.fn();
    component.reportIssue({});
    expect(component.commonUtilsSvc.reportIssue).toHaveBeenCalled();
  });

});
