import { Component, Input, OnInit, Inject, LOCALE_ID, ElementRef } from '@angular/core';
import { lastDayOfMonth, differenceInCalendarDays, isWithinInterval, isSameDay } from 'date-fns';

import { ChangePaymentMethodComponent } from '../../payment';
import { BillingHeaderService } from './billing-header.service';
import { DialogService } from '../../oneview-common/dialog/dialog.service';
import { defer, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * <example-url>../demo/#/billing/app-billing-header</example-url>
 */

@Component({
  selector: 'app-billing-header',
  templateUrl: './billing-header.component.html',
  styleUrls: ['./billing-header.component.scss']
})
export class BillingHeaderComponent implements OnInit {
  @Input() billingDetails;
  @Input() billingNotificationConfig;
  @Input() accountSummary;
  @Input() links = {
    payment: '/payment',
    automaticPayment: '/payment/automaticpayment',
    paymentHistory: '/payment/history',
    creditManagement: '/credit-management'
  };
  @Input() ptpInstallmentsErr = false;
  @Input() set ptpInstallments(data) {
    data = data || {};
    if (data) {
      this.ptpInstallmentsCount = data.count;
      this.upcomingInstallmentDate = data.upcomingInstallmentDate;
      this.upcomingAmount = data.upcomingAmount;
    }
  }
  @Input() notificationInfo$: Observable<{ billType: string; startDate: Date; endDate: Date }>;

  notificationMessage$ = defer(() => this.notificationInfo$).pipe(
    map(notificationInfo => {
      if (notificationInfo.billType && notificationInfo.startDate && notificationInfo.endDate) {
        return this.shouldShowNotification(notificationInfo.billType, notificationInfo.startDate, notificationInfo.endDate);
      } else {
        return '';
      }
    })
  );

  ptpInstallmentsCount: any;
  upcomingInstallmentDate: any;
  upcomingAmount: any;

  _mop: string;
  debitCardNumber: string;

  creditCard: any;
  debitCard: any;
  ccImg = '';

  ccExpiry: Date;
  ccExpiryDate: string;
  isCreditCardExpired: boolean;
  isCreditCardExpiring = false;
  daysTillExpired: number;

  isNotManual: boolean;
  isSuspended: boolean;

  showCCWarning: boolean;
  showNotification = false;
  currentLanguage: any;

  careNotificationMessage: any;

  creditLimitExceeded = false;
  almostAtCreditLimit = false;
  nearingCreditLimit = false;
  creditUsed: any;
  creditLimitWarningExists = false;

  constructor(
    private el: ElementRef,
    private dialog: DialogService,
    private billingHeader: BillingHeaderService,
    @Inject(LOCALE_ID) private language: string) {}

  ngOnInit() {
    this.currentLanguage = this.language ? this.language : 'en';
    this.isSuspended = this.accountSummary.accountStatus.toUpperCase() === 'SUSPENDED';
    this.setNotificationMessage();
    this._mop = this.billingDetails.methodOfPayment.mopType.toUpperCase();
    this.isNotManual = this._mop !== 'R';

    if (this._mop === 'D') {
      this.setDebitCardDetails();
    } else if (this._mop === 'C') {
      this.setCreditCardDetails();
    }

    this.creditUsed = this.getCreditUsed() || 0;
    this.creditLimitWarningExists = this.isInCreditLimitWarningStatus();
  }

  setDebitCardDetails() {
    this.debitCard = this.billingDetails.methodOfPayment.chequingDetails;
    this.debitCardNumber = this.debitCard.accountNumber;
  }

  setCreditCardDetails() {
    const cardImg = {
      visa: 'assets/visa.png',
      master: 'assets/master.png',
      amex: 'assets/amex.png'
    };
    this.creditCard = this.billingDetails.methodOfPayment.creditCardDetails;
    if (this.creditCard && this.creditCard.ccType) {
      this.ccImg = cardImg[this.creditCard.ccType.toLowerCase()];
    }
    this.ccExpiry = lastDayOfMonth(this.billingHeader.getLocalDate(this.creditCard.ccExpiry));
    this.ccExpiryDate = this.billingHeader.formatDate(this.ccExpiry, this.language);
    this.isCreditCardExpired = this.billingHeader.isCreditCardExpired(this.ccExpiry);
    this.isCreditCardExpiring = !this.isCreditCardExpired && this.billingHeader.isCreditCardExpiring(this.ccExpiry);
    this.showCCWarning = this.isCreditCardExpired || this.isCreditCardExpiring;
    this.daysTillExpired = this.isCreditCardExpiring && differenceInCalendarDays(this.ccExpiry, new Date());
  }

  openChangePayment(type) {
    const date =
      this.billingDetails && this.billingDetails.billDueDate
        ? this.billingHeader.formatDate(new Date(('' + this.billingDetails.billDueDate).replace('-', '/')), this.language)
        : null;

    const dialogComponent = this.dialog.open(ChangePaymentMethodComponent, {
      data: { accountSummary: this.accountSummary, type, date }
    });
    dialogComponent.$changedToManual.subscribe(res => res && (this.isNotManual = false));
  }

  openSchedulePTP(event) {
    event.stopPropagation();
    this.el.nativeElement.dispatchEvent(new CustomEvent('schedule-ptp', {
      detail: {},
      bubbles: true
    }));
  }

  openSchedulePTPHistory(event) {
    event.stopPropagation();
    this.el.nativeElement.dispatchEvent(new CustomEvent('schedule-ptp-history', {
      detail: {},
      bubbles: true
    }));
  }

  // PCR 24 - Prompt/Promote Online Billing & Auto Pay
  shouldShowNotification(billType, startDate, endDate): string {
    const currentDate = new Date();
    // if the date is in between the config dates or if the start date is the config start date
    // we should show the notification as long as the criteria below is met
    this.showNotification =
      isWithinInterval(currentDate, {
        start: startDate,
        end: endDate
      }) || isSameDay(currentDate, startDate);

    if (this.showNotification) {
      // Payment method is NOT PAP and Billing Method is NOT OLB
      if (!this.isNotManual && billType !== 'E_BILL') {
        return 'Set up Online Billing and Auto Pay';
      } else if (this.isNotManual && billType !== 'E_BILL') {
        // if Payment method is PAP and Billing Method is NOT OLB
        return 'Set up Online Billing for customer';
      } else if (!this.isNotManual && billType === 'E_BILL') {
        // if Payment method is NOT PAP and Billing Method is OLB
        return 'Set up Auto pay for customer';
      }
    } else {
      return '';
    }
  }

  setNotificationMessage() { // utilizing retail logic for care
    if (this.billingNotificationConfig) {
      const { startDate, endDate } = this.getStartEndDates(this.billingNotificationConfig);
      const billType = this.billingDetails.billType ? this.billingDetails.billType : 'error';
      this.careNotificationMessage = this.shouldShowNotification(billType, startDate, endDate);
    }
  }

  getStartEndDates(config) {
    if (!config.startDate || !config.endDate) {
      config.startDate = config.endDate = new Date();
    } else {
      const startDate = new Date(config.startDate.replace('-', '/'));
      const endDate = new Date(config.endDate.replace('-', '/'));
      return {startDate: startDate, endDate: endDate};
    }
    return {startDate: config.startDate, endDate: config.endDate};
  }

  getCreditUsed() {
    if (this.billingDetails) {
      const creditLimit = this.billingDetails.creditLimit || 0;
      const availCredit = this.billingDetails.availableCreditAmount || 0;
      return creditLimit - availCredit;
    }
  }

  getCLMPercentage() {
    const used: number = this.getCreditUsed() || 0;
    const creditLimit: number = this.billingDetails.creditLimit || 0;
    const percentage: number = (used / creditLimit) * 100;
    return percentage ? percentage : 0;
  }

  isInCreditLimitWarningStatus() {
      if (this.billingDetails.creditLimit <= 0) { return false; }
      const clmPercentage = this.getCLMPercentage();
      if (clmPercentage >= 100) {
        this.creditLimitExceeded = true;
        return true;
      } else if ((clmPercentage < 100) && (clmPercentage >= 75)) {
        this.almostAtCreditLimit = true;
        return true;
      } else if ((clmPercentage < 75) && (clmPercentage >= 60)) {
        this.nearingCreditLimit = true;
        return true;
      }
  }

}
