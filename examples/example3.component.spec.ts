// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component, ElementRef, LOCALE_ID } from '@angular/core';
import { BillingHeaderComponent } from './example3.component';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '../../oneview-common/dialog/dialog.service';
import { BillingHeaderService } from './billing-header.service';
import { PaymentService } from '../payment.service';
import { BillingDataService } from 'src/app/billing/billing-page/billing-data.service';

@Injectable()
class MockElementRef {
  nativeElement = {};
}

@Injectable()
class MockDialogService {}

@Injectable()
class MockBillingHeaderService {}

@Injectable()
class MockPaymentService {}

@Injectable()
class MockBillingDataService {}

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

describe('BillingHeaderComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        BillingHeaderComponent,
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
        { provide: ElementRef, useClass: MockElementRef },
        { provide: DialogService, useClass: MockDialogService },
        { provide: BillingHeaderService, useClass: MockBillingHeaderService },
        { provide: PaymentService, useClass: MockPaymentService },
        { provide: BillingDataService, useClass: MockBillingDataService },
        { provide: 'LOCALE_ID', useValue: 'en' }      ]
    }).overrideComponent(BillingHeaderComponent, {
      // set: { providers: [{ provide: MyComponentService, useClass: MyComponentService }] }
    }).compileComponents();
    fixture = TestBed.createComponent(BillingHeaderComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run SetterDeclaration #ptpInstallments', async () => {

    component.ptpInstallments = {
      count: '[object Object]',
      upcomingInstallmentDate: '[object Object]',
      upcomingAmount: '[object Object]'
    };

  });

  it('should run #ngOnInit()', async () => {
    component.route = component.route || {};
    component.route.snapshot = {
      params: {
        'ctn': '[object Object]'
      }
    };
    component.accountSummary = component.accountSummary || {};
    component.accountSummary.accountStatus = 'accountStatus';
    component.setNotificationMessage = jest.fn();
    component.billingDetails = component.billingDetails || {};
    component.billingDetails.methodOfPayment = {
      mopType: 'mopType'
    };
    component.setDebitCardDetails = jest.fn();
    component.setCreditCardDetails = jest.fn();
    component.getCreditUsed = jest.fn();
    component.isInCreditLimitWarningStatus = jest.fn();
    component.paymentService = component.paymentService || {};
    component.paymentService.getCreditCardConfig = jest.fn().mockReturnValue(observableOf({}));
    component.billingService = component.billingService || {};
    component.billingService.getBilling = jest.fn().mockReturnValue(observableOf(observableOf({})));
    component.ngOnInit();
    expect(component.setNotificationMessage).toHaveBeenCalled();
    expect(component.setDebitCardDetails).toHaveBeenCalled();
    expect(component.setCreditCardDetails).toHaveBeenCalled();
    expect(component.getCreditUsed).toHaveBeenCalled();
    expect(component.isInCreditLimitWarningStatus).toHaveBeenCalled();
    expect(component.paymentService.getCreditCardConfig).toHaveBeenCalled();
    expect(component.billingService.getBilling).toHaveBeenCalled();
  });

  it('should run #setDebitCardDetails()', async () => {
    component.billingDetails = component.billingDetails || {};
    component.billingDetails.methodOfPayment = {
      chequingDetails: '[object Object]'
    };
    component.debitCard = component.debitCard || {};
    component.debitCard.accountNumber = 'accountNumber';
    component.setDebitCardDetails();

  });

  it('should run #setCreditCardDetails()', async () => {
    component.billingDetails = component.billingDetails || {};
    component.billingDetails.methodOfPayment = {
      creditCardDetails: '[object Object]'
    };
    component.creditCard = component.creditCard || {};
    component.creditCard.ccType = 'ccType';
    component.creditCard.ccExpiry = 'ccExpiry';
    component.billingHeader = component.billingHeader || {};
    component.billingHeader.getLocalDate = jest.fn();
    component.billingHeader.formatDate = jest.fn();
    component.billingHeader.isCreditCardExpired = jest.fn();
    component.billingHeader.isCreditCardExpiring = jest.fn();
    component.setCreditCardDetails();
    expect(component.billingHeader.getLocalDate).toHaveBeenCalled();
    expect(component.billingHeader.formatDate).toHaveBeenCalled();
    expect(component.billingHeader.isCreditCardExpired).toHaveBeenCalled();
    expect(component.billingHeader.isCreditCardExpiring).toHaveBeenCalled();
  });

  it('should run #openChangePayment()', async () => {
    component.billingDetails = component.billingDetails || {};
    component.billingDetails.billDueDate = 'billDueDate';
    component.billingHeader = component.billingHeader || {};
    component.billingHeader.formatDate = jest.fn();
    component.dialog = component.dialog || {};
    component.dialog.open = jest.fn();
    component.openChangePayment({});
    expect(component.billingHeader.formatDate).toHaveBeenCalled();
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('should run #openSchedulePTP()', async () => {
    component.el = component.el || {};
    component.el.nativeElement = {
      dispatchEvent: jest.fn()
    };
    component.openSchedulePTP({
      stopPropagation: jest.fn()
    });

  });

  it('should run #openSchedulePTPHistory()', async () => {
    component.el = component.el || {};
    component.el.nativeElement = {
      dispatchEvent: jest.fn()
    };
    component.openSchedulePTPHistory({
      stopPropagation: jest.fn()
    });

  });

  it('should run #shouldShowNotification()', async () => {

    component.shouldShowNotification({}, {}, {});

  });

  it('should run #setNotificationMessage()', async () => {
    component.getStartEndDates = jest.fn();
    component.billingDetails = component.billingDetails || {};
    component.billingDetails.billType = 'billType';
    component.shouldShowNotification = jest.fn();
    component.setNotificationMessage();
    expect(component.getStartEndDates).toHaveBeenCalled();
    expect(component.shouldShowNotification).toHaveBeenCalled();
  });

  it('should run #getStartEndDates()', async () => {

    component.getStartEndDates({
      startDate: 'startDate',
      endDate: 'endDate'
    });

  });

  it('should run #getCreditUsed()', async () => {
    component.billingDetails = component.billingDetails || {};
    component.billingDetails.creditLimit = 'creditLimit';
    component.billingDetails.availableCreditAmount = 'availableCreditAmount';
    component.getCreditUsed();

  });

  it('should run #getCLMPercentage()', async () => {
    component.getCreditUsed = jest.fn();
    component.billingDetails = component.billingDetails || {};
    component.billingDetails.creditLimit = 'creditLimit';
    component.getCLMPercentage();
    expect(component.getCreditUsed).toHaveBeenCalled();
  });

  it('should run #isInCreditLimitWarningStatus()', async () => {
    component.billingDetails = component.billingDetails || {};
    component.billingDetails.creditLimit = 'creditLimit';
    component.getCLMPercentage = jest.fn();
    component.isInCreditLimitWarningStatus();
    expect(component.getCLMPercentage).toHaveBeenCalled();
  });

});
