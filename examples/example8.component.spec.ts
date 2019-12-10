// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { CreditManagementComponent } from './example8.component';
import { CreditManagementService } from './credit-management.service';
import { DialogService } from '@rogers/oneview-components';
import { TranslateService } from '@ngx-translate/core';
import { CreditManagementDataService } from './credit-management-data.service';
import { NavigationService } from '../framework/navigation.service';
import { Router } from '@angular/router';

@Injectable()
class MockCreditManagementService {}

@Injectable()
class MockTranslateService {
  translate() {};
}

@Injectable()
class MockCreditManagementDataService {}

@Injectable()
class MockNavigationService {}

@Injectable()
class MockRouter {
  navigate() {};
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

describe('CreditManagementComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        CreditManagementComponent,
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        OneviewPermittedDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: CreditManagementService, useClass: MockCreditManagementService },
        DialogService,
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: CreditManagementDataService, useClass: MockCreditManagementDataService },
        { provide: NavigationService, useClass: MockNavigationService },
        { provide: Router, useClass: MockRouter }
      ]
    }).overrideComponent(CreditManagementComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(CreditManagementComponent);
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
    component.creditManagementService = component.creditManagementService || {};
    component.creditManagementService.getAccountSummaryAndBillingDetails = jest.fn().mockReturnValue(observableOf({}));
    component.data = component.data || {};
    component.data.0 = '0';
    component.data.1 = '1';
    await component.ngOnInit();
    // expect(component.creditManagementService.getAccountSummaryAndBillingDetails).toHaveBeenCalled();
  });

  it('should run #resetValues()', async () => {

    component.resetValues({});

  });

  it('should run #resetAllFields()', async () => {
    component.resetValues = jest.fn();
    component.resetAllFields();
    // expect(component.resetValues).toHaveBeenCalled();
  });

  it('should run #servicePlanChanged()', async () => {
    component.resetAllFields = jest.fn();
    component.creditManagementService = component.creditManagementService || {};
    component.creditManagementService.getWireLessPostpaidDetails = jest.fn().mockReturnValue(observableOf({}));
    component.creditManagementService.getRecentAdjustments = jest.fn().mockReturnValue(observableOf({}));
    component.setAdjustmentTypesAndBills = jest.fn();
    await component.servicePlanChanged({});
    // expect(component.resetAllFields).toHaveBeenCalled();
    // expect(component.creditManagementService.getWireLessPostpaidDetails).toHaveBeenCalled();
    // expect(component.creditManagementService.getRecentAdjustments).toHaveBeenCalled();
    // expect(component.setAdjustmentTypesAndBills).toHaveBeenCalled();
  });

  it('should run #setAdjustmentTypesAndBills()', async () => {
    component.creditManagementService = component.creditManagementService || {};
    component.creditManagementService.getAdjustmentTypes = jest.fn().mockReturnValue(observableOf({}));
    component.creditManagementService.loadUserBill = jest.fn().mockReturnValue(observableOf({}));
    await component.setAdjustmentTypesAndBills();
    // expect(component.creditManagementService.getAdjustmentTypes).toHaveBeenCalled();
    // expect(component.creditManagementService.loadUserBill).toHaveBeenCalled();
  });

  it('should run #adjustmentTypeChanged()', async () => {
    component.resetValues = jest.fn();
    component.adjustmentTypeChanged({
      code: {}
    });
    // expect(component.resetValues).toHaveBeenCalled();
  });

  it('should run #billingCycleChanged()', async () => {
    component.resetValues = jest.fn();
    component.setCharges = jest.fn();
    component.creditManagementService = component.creditManagementService || {};
    component.creditManagementService.getAdjustmentCmsDetails = jest.fn().mockReturnValue(observableOf({}));
    await component.billingCycleChanged({});
    // expect(component.resetValues).toHaveBeenCalled();
    // expect(component.setCharges).toHaveBeenCalled();
    // expect(component.creditManagementService.getAdjustmentCmsDetails).toHaveBeenCalled();
  });

  it('should run #setCharges()', async () => {
    component.creditManagementService = component.creditManagementService || {};
    component.creditManagementService.getAdjustmentCharges = jest.fn().mockReturnValue(observableOf({}));
    component.openSystemError = jest.fn();
    await component.setCharges();
    // expect(component.creditManagementService.getAdjustmentCharges).toHaveBeenCalled();
    // expect(component.openSystemError).toHaveBeenCalled();
  });

  it('should run #handleChargeSelected()', async () => {

    await component.handleChargeSelected({});

  });

  it('should run #handleIssueChanged()', async () => {

    await component.handleIssueChanged({
      issueSelected: {
        autoAdjustment: {}
      },
      newInputEntered: {},
      isOpenOrClosed: {}
    });

  });

  it('should run #showAdjustmentForm()', async () => {

    component.showAdjustmentForm();

  });

  it('should run #formSubmitted()', async () => {
    component.creditManagementDataService = component.creditManagementDataService || {};
    component.creditManagementDataService.setDataAndCreateInteraction = jest.fn().mockReturnValue(observableOf({}));
    component.openInteractionOrSubmitModal = jest.fn();
    component.submitCreditManagement = jest.fn();
    await component.formSubmitted({});
    // expect(component.creditManagementDataService.setDataAndCreateInteraction).toHaveBeenCalled();
    // expect(component.openInteractionOrSubmitModal).toHaveBeenCalled();
    // expect(component.submitCreditManagement).toHaveBeenCalled();
  });

  it('should run #submitCreditManagement()', async () => {
    component.creditManagementDataService = component.creditManagementDataService || {};
    component.creditManagementDataService.setServiceAdjustmentAndBillData = jest.fn();
    component.creditManagementDataService.setChargeData = jest.fn();
    component.creditManagementDataService.setIssueData = jest.fn();
    component.creditManagementDataService.setFormData = jest.fn();
    component.creditManagementDataService.submitCreditManagement = jest.fn().mockReturnValue(observableOf({}));
    component.openInteractionOrSubmitModal = jest.fn();
    component.openSystemError = jest.fn();
    await component.submitCreditManagement({});
    // expect(component.creditManagementDataService.setServiceAdjustmentAndBillData).toHaveBeenCalled();
    // expect(component.creditManagementDataService.setChargeData).toHaveBeenCalled();
    // expect(component.creditManagementDataService.setIssueData).toHaveBeenCalled();
    // expect(component.creditManagementDataService.setFormData).toHaveBeenCalled();
    // expect(component.creditManagementDataService.submitCreditManagement).toHaveBeenCalled();
    // expect(component.openInteractionOrSubmitModal).toHaveBeenCalled();
    // expect(component.openSystemError).toHaveBeenCalled();
  });

  it('should run #openInteractionOrSubmitModal()', async () => {
    component.dialog = component.dialog || {};
    component.dialog.open = jest.fn().mockReturnValue({
      doneClicked: observableOf({})
    });
    component.dialog.close = jest.fn();
    component.selectedAdjustment = component.selectedAdjustment || {};
    component.selectedAdjustment.name = 'name';
    component.router = component.router || {};
    component.router.navigateByUrl = jest.fn();
    component.navigation = component.navigation || {};
    component.navigation.previousUrl = 'previousUrl';
    component.openInteractionOrSubmitModal({}, {
      adjustmentAmount: {}
    });
    // expect(component.dialog.open).toHaveBeenCalled();
    // expect(component.dialog.close).toHaveBeenCalled();
    // expect(component.router.navigateByUrl).toHaveBeenCalled();
  });

  it('should run #openSystemError()', async () => {
    component.translate = component.translate || {};
    component.translate.instant = jest.fn();
    component.dialog = component.dialog || {};
    component.dialog.open = jest.fn();
    component.openSystemError({}, {}, {});
    // expect(component.translate.instant).toHaveBeenCalled();
    // expect(component.dialog.open).toHaveBeenCalled();
  });

});
