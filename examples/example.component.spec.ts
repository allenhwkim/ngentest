// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
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
        baz: function() {
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
  get = function() {};
  foo = function() {
    return {
      bar: {
        baz: function() {}
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
      foo: function() {
        return {
          bar: {}
        };
      }
    };
  };
  navigate() {};
}

@Injectable()
class MockCommonUtilsService {}

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

describe('ExampleComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        ExampleComponent,
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        OneviewPermittedDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: AuthGuardService, useClass: MockAuthGuardService },
        { provide: CookieService, useClass: MockCookieService },
        { provide: AppLoadService, useClass: MockAppLoadService },
        { provide: 'PLATFORM_ID', useValue: 'browser' },
        { provide: Router, useClass: MockRouter },
        { provide: CommonUtilsService, useClass: MockCommonUtilsService }
      ]
    }).overrideComponent(ExampleComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(ExampleComponent);
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
    component.adjustmentsDetailsCms = component.adjustmentsDetailsCms || {};
    component.adjustmentsDetailsCms.location = {
      threshold: {}
    };
    component.router = component.router || {};
    component.router.events = observableOf({
      urlAfterRedirects: 'urlAfterRedirects'
    });
    component.menuEl = component.menuEl || {};
    component.menuEl.nativeElement = {
      highlightMenu: function() {}
    };
    component.ngOnInit();

  });

  it('should run #logout()', async () => {
    component.authGuardSvc = component.authGuardSvc || {};
    component.authGuardSvc.logoff = jest.fn();
    component.logout();
    // expect(component.authGuardSvc.logoff).toHaveBeenCalled();
  });

  it('should run #changeLanguage()', async () => {
    component.cookie = component.cookie || {};
    component.cookie.get = jest.fn();
    window.location.reload = jest.fn();
    component.changeLanguage({});
    // expect(component.cookie.get).toHaveBeenCalled();
    // expect(window.location.reload).toHaveBeenCalled();
  });

  it('should run #onDeactivate()', async () => {
    window.scrollTo = jest.fn();
    component.onDeactivate();
    // expect(window.scrollTo).toHaveBeenCalled();
  });

  it('should run #changeRoute()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.changeRoute({
      detail: 'detail'
    });
    // expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #reportIssue()', async () => {
    component.commonUtilsSvc = component.commonUtilsSvc || {};
    component.commonUtilsSvc.reportIssue = jest.fn();
    component.reportIssue({});
    // expect(component.commonUtilsSvc.reportIssue).toHaveBeenCalled();
  });

});
