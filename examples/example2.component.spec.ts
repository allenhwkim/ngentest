// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component, LOCALE_ID } from '@angular/core';
import { Example2Component } from './example2.component';
import { FormBuilder } from '@angular/forms';

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

describe('Example2Component', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        Example2Component,
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        OneviewPermittedDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: 'LOCALE_ID', useValue: 'en' }
      ]
    }).overrideComponent(Example2Component, {

    }).compileComponents();
    fixture = TestBed.createComponent(Example2Component);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run SetterDeclaration #showFlow', async () => {
    component.getControlsAndCreateForm = jest.fn();
    component.showFlow = {};
    // expect(component.getControlsAndCreateForm).toHaveBeenCalled();
  });

  it('should run GetterDeclaration #myData', async () => {
    component.data = component.data || {};
    component.data.tooltip = {
      amount: 'amount',
      site: 'site'
    };
    component.data.location = {
      threshold: {},
      sites: {}
    };
    const myData = component.myData;

  });

  it('should run #ngOnInit()', async () => {
    component.createForm = jest.fn();
    component.ngOnInit();
    // expect(component.createForm).toHaveBeenCalled();
  });

  it('should run #createForm()', async () => {
    component.getControls = jest.fn();
    component.getFormControls = jest.fn();
    component.createForm = jest.fn();
    component.formBuilder = component.formBuilder || {};
    component.formBuilder.group = jest.fn();
    component.handleFoo = jest.fn();
    component.handleBar = jest.fn();
    component.createForm({});
    // expect(component.getControls).toHaveBeenCalled();
    // expect(component.getFormControls).toHaveBeenCalled();
    // expect(component.createForm).toHaveBeenCalled();
    // expect(component.formBuilder.group).toHaveBeenCalled();
    // expect(component.handleFoo).toHaveBeenCalled();
    // expect(component.handleBar).toHaveBeenCalled();
  });

  it('should run #getFormControls()', async () => {
    component.selectedType = component.selectedType || {};
    component.selectedType.code = 'code';
    component.getControls = jest.fn();
    component.getFormControls();
    // expect(component.getControls).toHaveBeenCalled();
  });

  it('should run #getControls()', async () => {
    component.formControlsKeys = component.formControlsKeys || {};
    component.formControlsKeys = ['formControlsKeys'];
    component.getControls();

  });

  it('should run #handleBar()', async () => {
    component.data = component.data || {};
    component.data.location = {
      threshold: {}
    };
    component.myForm = component.myForm || {};
    component.myForm.get = jest.fn().mockReturnValue({
      valueChanges: observableOf({})
    });
    component.isValid = jest.fn();
    component.handleFoo = jest.fn();
    component.handleBar();
    // expect(component.myForm.get).toHaveBeenCalled();
    // expect(component.isValid).toHaveBeenCalled();
    // expect(component.handleFoo).toHaveBeenCalled();
  });

  it('should run #handleFoo()', async () => {
    component.myForm = component.myForm || {};
    component.myForm.get = jest.fn().mockReturnValue({
      setValue: function() {},
      valueChanges: observableOf({})
    });
    component.details = component.details || {};
    component.details.content = {
      moreDetails: {
        plan: {}
      }
    };
    component.handleFoo();
    // expect(component.myForm.get).toHaveBeenCalled();
  });

  it('should run #getAmount()', async () => {
    component.data = component.data || {};
    component.data.amount = 'amount';
    component.data.amount2 = 'amount2';
    component.selected = component.selected || {};
    component.selected.id = 'id';
    component.myForm = component.myForm || {};
    component.myForm.get = jest.fn().mockReturnValue({
      valid: {}
    });
    component.getAmount();
    // expect(component.myForm.get).toHaveBeenCalled();
  });

  it('should run #isFieldValid()', async () => {

    component.isFieldValid({
      touched: {},
      valid: {}
    });

  });

  it('should run #isValid()', async () => {
    component.getAmount = jest.fn();
    component.isValid();
    // expect(component.getAmount).toHaveBeenCalled();
  });

  it('should run #submit()', async () => {
    component.formSubmitted = component.formSubmitted || {};
    component.formSubmitted.emit = jest.fn();
    component.myForm = component.myForm || {};
    component.myForm.value = 'value';
    component.submit();
    // expect(component.formSubmitted.emit).toHaveBeenCalled();
  });

});
