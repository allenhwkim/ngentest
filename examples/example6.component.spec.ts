// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { BillingPageComponent } from './example6.component';
import { DialogService, CommonDataService } from '@rogers/oneview-components';
import { DomSanitizer } from '@angular/platform-browser';
import { BillingDataService } from './billing-data.service';
import { SchedulePtpDataService } from '../schedule-ptp/schedule-ptp-data.service';
import { PaymentService } from '../../payment/payment.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NavigationService } from '../../framework/navigation.service';
import { TranslateService } from '@ngx-translate/core';
import { BillingDateHandlerService } from './billing-date-handler.service';

@Injectable()
class MockBillingDataService {
  catchError = function() {
    return observableOf({});
  };
  getBilling = jest.fn();
  loadUserBill = jest.fn();
}

@Injectable()
class MockSchedulePtpDataService {}

@Injectable()
class MockPaymentService {}

@Injectable()
class MockRouter {
  navigate = jest.fn();
}

@Injectable()
class MockNavigationService {}

@Injectable()
class MockTranslateService {
  translate = jest.fn();
}

@Injectable()
class MockBillingDateHandlerService {
  toShowNotification = jest.fn();
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

describe('BillingPageComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        BillingPageComponent,
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        OneviewPermittedDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        DialogService,
        DomSanitizer,
        { provide: BillingDataService, useClass: MockBillingDataService },
        { provide: SchedulePtpDataService, useClass: MockSchedulePtpDataService },
        { provide: PaymentService, useClass: MockPaymentService },
        CommonDataService,
        { provide: Router, useClass: MockRouter },
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
        { provide: NavigationService, useClass: MockNavigationService },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: BillingDateHandlerService, useClass: MockBillingDateHandlerService }
      ]
    }).overrideComponent(BillingPageComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(BillingPageComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run GetterDeclaration #billSelection', async () => {

    const billSelection = component.billSelection;

  });

  it('should run SetterDeclaration #billSelection', async () => {

    component.billSelection = {};

  });

  it('should run #ngOnInit()', async () => {
    component.route = component.route || {};
    component.route.snapshot = {
      queryParams: {
        'defaultTab': {}
      }
    };
    component.navigationService = component.navigationService || {};
    component.navigationService.isRoutedFromPayment = 'isRoutedFromPayment';
    component.router = component.router || {};
    component.router.events = observableOf({});
    component.ptpService = component.ptpService || {};
    component.ptpService.getAllPtpInfo = jest.fn().mockReturnValue(observableOf({
      ptpDetails: {
        length: {}
      }
    }));
    component.setBillingHeaderPTPMessage = jest.fn();
    component.paymentService = component.paymentService || {};
    component.paymentService.getPaymentHistory = jest.fn().mockReturnValue(observableOf({}));
    component.billingService = component.billingService || {};
    component.billingService.getBillingNotificationConfig = jest.fn().mockReturnValue(observableOf({}));
    component.ngOnInit();
    expect(component.ptpService.getAllPtpInfo).toHaveBeenCalled();
    expect(component.setBillingHeaderPTPMessage).toHaveBeenCalled();
    expect(component.paymentService.getPaymentHistory).toHaveBeenCalled();
    expect(component.billingService.getBillingNotificationConfig).toHaveBeenCalled();
  });

  it('should run #getPTPInstallments()', async () => {
    component.ptpService = component.ptpService || {};
    component.ptpService.getPTPInstallments = jest.fn().mockReturnValue(observableOf({
      installments: {
        length: {}
      }
    }));
    component.getPTPInstallments({
      detail: {
        ptpId: {}
      }
    });
    expect(component.ptpService.getPTPInstallments).toHaveBeenCalled();
  });

  it('should run #setBillingHeaderPTPMessage()', async () => {
    component.billingService = component.billingService || {};
    component.billingService.getPTPIDForHeader = jest.fn();
    component.ptpService = component.ptpService || {};
    component.ptpService.getPTPInstallments = jest.fn().mockReturnValue(observableOf({
      installments: {
        length: {}
      }
    }));
    component.setBillingHeaderPTPMessage();
    expect(component.billingService.getPTPIDForHeader).toHaveBeenCalled();
    expect(component.ptpService.getPTPInstallments).toHaveBeenCalled();
  });

  it('should run #setTranslations()', async () => {
    component.billingService = component.billingService || {};
    component.billingService.getBillType = jest.fn().mockReturnValue(observableOf({}));
    component.dateHandler = component.dateHandler || {};
    component.dateHandler.getCurrentCycleEndDate = jest.fn();
    component.billSelection = component.billSelection || {};
    component.billSelection.issue_date = 'issue_date';
    component.translate = component.translate || {};
    component.translate.instant = jest.fn().mockReturnValue('ngentest');
    component.setTranslations();
    expect(component.billingService.getBillType).toHaveBeenCalled();
    expect(component.dateHandler.getCurrentCycleEndDate).toHaveBeenCalled();
    expect(component.translate.instant).toHaveBeenCalled();
  });

  it('should run #downloadBillAs()', async () => {
    component.dialog = component.dialog || {};
    component.dialog.open = jest.fn();
    component.fetchResource = jest.fn().mockReturnValue(observableOf({}));
    component.downloadBillAs({});
    expect(component.dialog.open).toHaveBeenCalled();
    expect(component.fetchResource).toHaveBeenCalled();
  });

  it('should run #fetchResource()', async () => {
    component.billingService = component.billingService || {};
    component.billingService.getEncryptedString = jest.fn().mockReturnValue(observableOf({}));
    component.billingService.fetchUserBill = jest.fn().mockReturnValue(observableOf({}));
    component.billingService.downloadFile = jest.fn();
    component.billSelection = component.billSelection || {};
    component.billSelection.content_id = 'content_id';
    component.billSelection.issue_date = 'issue_date';
    component.dialog = component.dialog || {};
    component.dialog.close = jest.fn();
    component.dialog.open = jest.fn();
    component.fetchResource({});
    expect(component.billingService.getEncryptedString).toHaveBeenCalled();
    expect(component.billingService.fetchUserBill).toHaveBeenCalled();
    expect(component.billingService.downloadFile).toHaveBeenCalled();
    expect(component.dialog.close).toHaveBeenCalled();
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('should run #printPDF()', async () => {
    component.dialog = component.dialog || {};
    component.dialog.open = jest.fn();
    component.dialog.close = jest.fn();
    component.billingService = component.billingService || {};
    component.billingService.getEncryptedString = jest.fn().mockReturnValue(observableOf({}));
    component.billingService.resolveIFrameUrl = jest.fn();
    component.sanitize = component.sanitize || {};
    component.sanitize.bypassSecurityTrustResourceUrl = jest.fn();
    component.billSelection = component.billSelection || {};
    component.billSelection.link = 'link';
    component.printPDF();
    expect(component.dialog.open).toHaveBeenCalled();
    expect(component.dialog.close).toHaveBeenCalled();
    expect(component.billingService.getEncryptedString).toHaveBeenCalled();
    expect(component.billingService.resolveIFrameUrl).toHaveBeenCalled();
    expect(component.sanitize.bypassSecurityTrustResourceUrl).toHaveBeenCalled();
  });

  it('should run #savePDF()', async () => {
    component.dialog = component.dialog || {};
    component.dialog.open = jest.fn();
    component.dialog.close = jest.fn();
    component.billingService = component.billingService || {};
    component.billingService.getEncryptedString = jest.fn().mockReturnValue(observableOf({}));
    component.billingService.resolveIFrameUrl = jest.fn();
    component.billSelection = component.billSelection || {};
    component.billSelection.link = 'link';
    window.open = jest.fn();
    component.savePDF();
    expect(component.dialog.open).toHaveBeenCalled();
    expect(component.dialog.close).toHaveBeenCalled();
    expect(component.billingService.getEncryptedString).toHaveBeenCalled();
    expect(component.billingService.resolveIFrameUrl).toHaveBeenCalled();
    expect(window.open).toHaveBeenCalled();
  });

  it('should run #setIframeHeight()', async () => {
    component.iFrameBill = component.iFrameBill || {};
    component.iFrameBill.first = {
      nativeElement: {}
    };
    component.setIframeHeight({});

  });

  it('should run #schedulePTPHistoryClicked()', async () => {

    component.schedulePTPHistoryClicked({});

  });

  it('should run #ptpLinkSelected()', async () => {
    component.ptpService = component.ptpService || {};
    component.ptpService.checkPendingPTP = jest.fn().mockReturnValue(observableOf({
      ptpPaymentInfo: {},
      ptpPendingIndicator: {}
    }));
    component.billingDetails = component.billingDetails || {};
    component.billingDetails.balanceAmount = 'balanceAmount';
    component.dialog = component.dialog || {};
    component.dialog.open = jest.fn();
    component.checkEligibility = jest.fn();
    component.openSystemError = jest.fn();
    component.ptpLinkSelected({});
    expect(component.ptpService.checkPendingPTP).toHaveBeenCalled();
    expect(component.dialog.open).toHaveBeenCalled();
    expect(component.checkEligibility).toHaveBeenCalled();
    expect(component.openSystemError).toHaveBeenCalled();
  });

  it('should run #checkEligibility()', async () => {
    component.ptpService = component.ptpService || {};
    component.ptpService.checkPTPElgibility = jest.fn().mockReturnValue(observableOf({
      inEligibleReasonCodes: {},
      isPTPEligible: {}
    }));
    component.billingDetails = component.billingDetails || {};
    component.billingDetails.balanceAmount = 'balanceAmount';
    component.showSchedulePtp = jest.fn();
    component.dialog = component.dialog || {};
    component.dialog.open = jest.fn();
    component.openSystemError = jest.fn();
    component.checkEligibility();
    expect(component.ptpService.checkPTPElgibility).toHaveBeenCalled();
    expect(component.showSchedulePtp).toHaveBeenCalled();
    expect(component.dialog.open).toHaveBeenCalled();
    expect(component.openSystemError).toHaveBeenCalled();
  });

  it('should run #showSchedulePtp()', async () => {
    component.ptpService = component.ptpService || {};
    component.ptpService.getNovaLinks = jest.fn().mockReturnValue(observableOf({
      ptp: {
        fr: {},
        en: {}
      }
    }));
    component.commonData = component.commonData || {};
    component.commonData.language = 'language';
    component.dialog = component.dialog || {};
    component.dialog.open = jest.fn();
    component.billingDetails = component.billingDetails || {};
    component.billingDetails.balanceAmount = 'balanceAmount';
    component.savePtp = jest.fn();
    component.openSystemError = jest.fn();
    component.showSchedulePtp();
    expect(component.ptpService.getNovaLinks).toHaveBeenCalled();
    expect(component.dialog.open).toHaveBeenCalled();
    expect(component.savePtp).toHaveBeenCalled();
    expect(component.openSystemError).toHaveBeenCalled();
  });

  it('should run #savePtp()', async () => {
    component.translate = component.translate || {};
    component.translate.instant = jest.fn();
    component.ptpService = component.ptpService || {};
    component.ptpService.schedulePTP = jest.fn().mockReturnValue(observableOf({
      status: {}
    }));
    component.dialog = component.dialog || {};
    component.dialog.open = jest.fn();
    component.openSystemError = jest.fn();
    component.savePtp({});
    expect(component.translate.instant).toHaveBeenCalled();
    expect(component.ptpService.schedulePTP).toHaveBeenCalled();
    expect(component.dialog.open).toHaveBeenCalled();
    expect(component.openSystemError).toHaveBeenCalled();
  });

  it('should run #openSystemError()', async () => {
    component.translate = component.translate || {};
    component.translate.instant = jest.fn();
    component.dialog = component.dialog || {};
    component.dialog.open = jest.fn();
    component.openSystemError({});
    expect(component.translate.instant).toHaveBeenCalled();
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('should run #handleError()', async () => {

    component.handleError({
      error: {}
    });

  });

});
