// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component, LOCALE_ID } from '@angular/core';
import { AdjustmentFormComponent } from './example2.component';
import { FormBuilder } from '@angular/forms';

@Pipe({name: 'translate'})
class TranslatePipe implements PipeTransform { 
  transform(value) { return value; } 
}

describe('AdjustmentFormComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [ AdjustmentFormComponent, TranslatePipe ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: 'LOCALE_ID', useValue: 'en' }      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AdjustmentFormComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.getControlsAndCreateForm = jest.fn();
    component.ngOnInit();
    expect(component.getControlsAndCreateForm).toHaveBeenCalled();
  });

  it('should run #getControlsAndCreateForm()', async () => {
    component.getAutomaticFlowFormControls = jest.fn();
    component.getSpecificFormControls = jest.fn();
    component.createForm = jest.fn();
    component.getControlsAndCreateForm();
    expect(component.getAutomaticFlowFormControls).toHaveBeenCalled();
    expect(component.getSpecificFormControls).toHaveBeenCalled();
    expect(component.createForm).toHaveBeenCalled();
  });

  it('should run #createForm()', async () => {
    component.formBuilder = component.formBuilder || {};
    component.formBuilder.group = jest.fn();
    component.handleDaysAffected = jest.fn();
    component.handleAdjustmentValueChange = jest.fn();
    component.createForm({});
    expect(component.formBuilder.group).toHaveBeenCalled();
    expect(component.handleDaysAffected).toHaveBeenCalled();
    expect(component.handleAdjustmentValueChange).toHaveBeenCalled();
  });

  it('should run #getAutomaticFlowFormControls()', async () => {
    component.getControls = jest.fn();
    component.getAutomaticFlowFormControls();
    expect(component.getControls).toHaveBeenCalled();
  });

  it('should run #getSpecificFormControls()', async () => {
    component.selectedAdjustmentType = component.selectedAdjustmentType || {};
    component.selectedAdjustmentType.code = 'code';
    component.getControls = jest.fn();
    component.getSpecificFormControls();
    expect(component.getControls).toHaveBeenCalled();
  });

  it('should run #getControls()', async () => {
    component.formControlsKeys = component.formControlsKeys || {};
    component.formControlsKeys = ['formControlsKeys'];
    component.getControls();

  });

  it('should run #handleAdjustmentValueChange()', async () => {
    component.adjustmentsDetailsCms = component.adjustmentsDetailsCms || {};
    component.adjustmentsDetailsCms.location = {
      threshold: '[object Object]'
    };
    component.adjustmentForm = component.adjustmentForm || {};
    component.adjustmentForm.get = jest.fn().mockReturnValue(function() {
      return {
        valueChanges: {
          subscribe : function() {
            return {
              type: "Observable",
              value: '[object Object]'
            };
          }
        }
      };
    });
    component.adjustmentFieldInValidation = jest.fn();
    component.handleSiteField = jest.fn();
    component.handleAdjustmentValueChange();
    expect(component.adjustmentForm.get).toHaveBeenCalled() {
      return {
        valueChanges: {
          subscribe : function() {
            return {
              type: "Observable",
              value: '[object Object]'
            };
          }
        }
      };
    });
    expect(component.adjustmentFieldInValidation).toHaveBeenCalled();
    expect(component.handleSiteField).toHaveBeenCalled();
  });

  it('should run #handleDaysAffected()', async () => {
    component.adjustmentForm = component.adjustmentForm || {};
    component.adjustmentForm.get = jest.fn();
    component.wirelessPostpaidDetails = component.wirelessPostpaidDetails || {};
    component.wirelessPostpaidDetails.content = {
      postPaidPhoneDetails: {
        planMSF: {}
      }
    };
    component.handleDaysAffected();
    expect(component.adjustmentForm.get).toHaveBeenCalled();
  });

  it('should run #getValidationAndSetSpecificErrorsForAmount()', async () => {

    component.getValidationAndSetSpecificErrorsForAmount();

  });

  it('should run #handleSiteField()', async () => {
    component.adjustmentForm = component.adjustmentForm || {};
    component.adjustmentForm.get = jest.fn();
    component.handleSiteField({});
    expect(component.adjustmentForm.get).toHaveBeenCalled();
  });

  it('should run #isFieldValid()', async () => {

    component.isFieldValid({
      touched: '[object Object]',
      valid: '[object Object]'
    });

  });

  it('should run #adjustmentFieldInValidation()', async () => {
    component.getValidationAndSetSpecificErrorsForAmount = jest.fn();
    component.adjustmentFieldInValidation();
    expect(component.getValidationAndSetSpecificErrorsForAmount).toHaveBeenCalled();
  });

  it('should run #submit()', async () => {
    component.formSubmitted = component.formSubmitted || {};
    component.formSubmitted.emit = jest.fn();
    component.adjustmentForm = component.adjustmentForm || {};
    component.adjustmentForm.value = 'value';
    component.submit();
    expect(component.formSubmitted.emit).toHaveBeenCalled();
  });

});
