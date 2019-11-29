// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PastUsageComponent } from './example10.component';

@Directive({ selector: '[oneviewPermitted]' }) // TODO, template must be user-configurable
class OneviewPermittedDirective {
  @Input() oneviewPermitted;
}

@Pipe({name: 'translate'}) // TODO, template must be user-configurable
class TranslatePipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({name: 'phoneNumber'}) // TODO, template must be user-configurable
class PhoneNumberPipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({name: 'safeHtml'}) // TODO, template must be user-configurable
class SafeHtmlPipe implements PipeTransform {
  transform(value) { return value; }
}

describe('PastUsageComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        PastUsageComponent, TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        OneviewPermittedDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
              ]
    }).overrideComponent(PastUsageComponent, {
      // set: { providers: [{ provide: MyComponentService, useClass: MyComponentService }] }
    }).compileComponents();
    fixture = TestBed.createComponent(PastUsageComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.getPastUsage = jest.fn();
    component.dates = component.dates || {};
    component.dates = ['dates'];
    component.getDatesRange = jest.fn();
    component.ngOnInit();
    expect(component.getPastUsage).toHaveBeenCalled();
    expect(component.getDatesRange).toHaveBeenCalled();
  });

  it('should run #getDatesRange()', async () => {

    component.getDatesRange({});

  });

  it('should run #getPastUsage()', async () => {

    component.getPastUsage(['bills'], ['pricePlansList']);

  });

});
