// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { Example4Component } from './example4.component';
import { ActivatedRoute } from '@angular/router';
import { ServiceFive } from '@ngx-serviceFive/core';

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

describe('Example4Component', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        Example4Component,
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
        ServiceFive
      ]
    }).overrideComponent(Example4Component, {

    }).compileComponents();
    fixture = TestBed.createComponent(Example4Component);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run SetterDeclaration #pppCcccc', async () => {

    component.pppCcccc = {};

  });

  it('should run GetterDeclaration #pppCcccc', async () => {

    const pppCcccc = component.pppCcccc;

  });

  it('should run #ngOnInit()', async () => {
    component.route = component.route || {};
    component.route.snapshot = {
      data: {
        'iiiiiiiii': {}
      }
    };
    component.getIiiiiiiii = jest.fn();
    component.iiiiiiiii = component.iiiiiiiii || {};
    component.iiiiiiiii = ['iiiiiiiii'];
    component.ngOnInit();
    // expect(component.getIiiiiiiii).toHaveBeenCalled();
  });

  it('should run #ngAfterViewInit()', async () => {

    component.ngAfterViewInit();

  });

  it('should run #applyFilter()', async () => {

    component.applyFilter({
      target: {
        value: {}
      }
    });

  });

  it('should run #getIiiiiiiii()', async () => {
    component.serviceFive = component.serviceFive || {};
    component.serviceFive.instant = jest.fn();
    component.getIiiiiiiii({
      error: {},
      filter: function() {
        return [
          {
            "tttIiii": {}
          }
        ];
      }
    });
    // expect(component.serviceFive.instant).toHaveBeenCalled();
  });

  it('should run #searchIiiiiiiii()', async () => {

    component.searchIiiiiiiii({});

  });

  it('should run #tttSssIii()', async () => {

    component.tttSssIii('tttIiii', 'param');

  });

});
