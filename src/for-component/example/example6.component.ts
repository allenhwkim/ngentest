import { Component, ViewChildren, QueryList, ElementRef, OnInit } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { trigger, transition, style, animate } from '@angular/animations';

import { TranslateService } from '@ngx-translate/core';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { combineLatest, defer, of } from 'rxjs';
import { catchError, take, filter, map, mergeMap, shareReplay, tap } from 'rxjs/operators';

import { LoadingComponent, CommonDataService, ProfileErrorComponent } from '@rogers/oneview-components';
import { SchedulePtpDialogComponent } from '../schedule-ptp/schedule-ptp-dialog.component';
import { SchedulePtpFailureDialogComponent } from '../schedule-ptp/schedule-ptp-failure-dialog.component';
import { DialogOptions, DialogService, ErrorComponent, SuccessComponent } from '@rogers/oneview-components';
import { BillingDownloadFailureComponent, BillingDownloadSuccessComponent } from '@rogers/oneview-components';
import { BillingDataService } from './billing-data.service';
import { PaymentService } from '../../payment/payment.service';
import { SchedulePtpDataService } from '../schedule-ptp/schedule-ptp-data.service';
import { BillingDateHandlerService } from './billing-date-handler.service';
import { NavigationService } from '../../framework/navigation.service';

@Component({
  selector: 'app-billing-page',
  templateUrl: './billing-page.component.html',
  styleUrls: ['./billing-page.component.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, maxHeight: '0', overflow: 'hidden', padding: '0 8px' }),
        animate('.5s', style({ opacity: 1, maxHeight: '250px', padding: '8px' }))
      ])
    ])
  ]
})

export class BillingPageComponent implements OnInit {

  get billSelection() {
    return this.__billSelection;
  }

  set billSelection(bill) {
    this.__billSelection = bill;
    const url = `/web/totes/viewInvoiceDetail.html?` + `accountNumber=${this.accountNumber}&link=${bill.link}`;
    this.iframeSrc = this.sanitize.bypassSecurityTrustResourceUrl(url); // needed for NG context
  }

  constructor(
    private dialog: DialogService,
    private sanitize: DomSanitizer,
    private billingService: BillingDataService,
    private ptpService: SchedulePtpDataService,
    private paymentService:  PaymentService,
    private commonData: CommonDataService,
    private router: Router,
    private route: ActivatedRoute,
    private navigationService: NavigationService,
    private translate: TranslateService,
    private dateHandler: BillingDateHandlerService
  ) {
    this.language = commonData.language;
    this.accountSummary = commonData.accountSummary;
    this.iframeSrc = this.sanitize.bypassSecurityTrustResourceUrl('about:blank'); // needed for NG context
    this.printPDFSrc = this.sanitize.bypassSecurityTrustResourceUrl('about:blank'); // needed for NG context
  }
  accountNumber;
  accountSummary: any;
  billingDetails: any;
  showSuccessPayment = false;
  paymentHistory: any;
  allPtpInfo: any;
  allPtpInfoErr = false;
  noHistoryMessage = false;
  ptpInstallmentsHeader: any;
  ptpInstallmentsHeaderErr = false;
  ptpInstallments: any;
  ptpInstallmentsErr = false;
  billingNotificationConfig: any;
  billingNotificationConfigErr = false;

  @ViewChildren('iFrameBill', { read: ElementRef }) iFrameBill: QueryList<any>;

  today = new Date();
  language;
  defaultTab = 'bill';

  billCycleEndDate;
  billMessage;

  iframeSrc: any;
  printPDFSrc: any;

  overlayStatus; // ERROR (OR) INFO

  dialogOptionsError: DialogOptions = {
    showCloseButton: false
  };

  __billSelection;

  encryptAPIError$ = this.billingService.catchError().pipe(
    tap(e => this.handleError(e)),
    map(e => !!e)
  );

  bill$ = defer(() => {
    this.dialog.open(LoadingComponent, this.dialogOptionsError);
    return this.billingService.getBilling();
  }).pipe(
    tap(bill => {
      this.billingDetails = bill;
      this.billCycleEndDate = (<any>bill).billCycleEndDate;
    }),
    catchError(error => of(error)),
    shareReplay(1)
  );

  account$ = defer(() => of(this.accountSummary)).pipe(
    map(summary => {
      const { accountNumber, accountStatus, billing, accountTypeNumber } = summary;
      return { accountNumber, accountStatus, billing, accountTypeNumber };
    }),
    tap(summary => (this.accountNumber = summary.accountNumber)),
    shareReplay()
  );

  bills$ = defer(() => {
    this.dialog.open(LoadingComponent, this.dialogOptionsError);
    return this.billingService.loadUserBill();
  }).pipe(
    map((userBills: any) =>
      userBills.bills.map(bill => {
        const temp = bill.issue_date;
        const issue_date = new Date(temp.replace('-', '/'));
        return { ...bill, issue_date };
      })
    ),
    catchError(error => of(error)),
    tap(bills => {
      if (bills && bills.length > 0) {
        this.billSelection = bills[0];
      }
    }),
    shareReplay(1)
  );

  overlay$ = combineLatest(this.bill$, this.bills$).pipe(
    map(([bill, bills]) => {
      if (bill.billCycleEndDate && bills.length === 0) {
        this.overlayStatus = 'INFO';
      } else if (bill.error || bills.error) {
        this.overlayStatus = 'ERROR';
      }
      return this.overlayStatus;
    })
  );

  showNotification$ = combineLatest(this.account$, this.bills$, this.bill$).pipe(
    map(([account, bills, bill]) => {
      if (
        account.accountTypeNumber !== 1 ||
        (account.accountStatus.toLowerCase() !== 'open' && account.accountStatus.toLowerCase() !== 'active')
      ) {
        return false;
      } else {
        return this.dateHandler.toShowNotification(bills[0].issue_date, bill.billCycleEndDate);
      }
    }),
    catchError(_ => of(false)),
    tap(show => {
      this.dialog.close();
      if (show) {
        this.setTranslations();
      }
    })
  );

  ngOnInit() {
    const queryParams = this.route.snapshot.queryParams['defaultTab'];
    this.defaultTab = queryParams ? queryParams : this.defaultTab;

    this.showSuccessPayment = this.navigationService.isRoutedFromPayment;

    if (this.showSuccessPayment) {
      this.router.events.pipe( // once we navigate away from page we should not show the banner again
        take(1), filter(event => event instanceof NavigationStart)
      ).subscribe(() => {
        this.navigationService.isRoutedFromPayment = false;
      });
    }

    this.ptpService.getAllPtpInfo().subscribe(
      (resp: any) => {
        const isValidAllPTPInfoResponse = resp && resp.ptpDetails && resp.ptpDetails.length;
        if (isValidAllPTPInfoResponse) {
          this.allPtpInfo = resp; // for billing page use
          this.setBillingHeaderPTPMessage(); // for billing header values only
        } else {
          if (resp.ptpDetails && resp.ptpDetails.length === 0) {
            this.noHistoryMessage = true;
          }
          // other business error
          this.allPtpInfoErr = true;
          this.ptpInstallmentsErr = true;
        }
      },
      error => {
        this.allPtpInfoErr = true;
        this.ptpInstallmentsErr = true;
      }
    );

    this.paymentService.getPaymentHistory().subscribe(
      resp => this.paymentHistory =  resp,
      error => console.log('error getting payment history: ',  error)
    );

    this.billingService.getBillingNotificationConfig().subscribe(
      resp => this.billingNotificationConfig = resp,
      error => this.billingNotificationConfigErr = true
      );
  }

  getPTPInstallments(event) { // for future event calls to update installments
    if (event.detail.ptpId) {
      this.ptpService.getPTPInstallments(event.detail.ptpId).subscribe(
        (resp: any) => {
          if (resp.installments && resp.installments.length) {
            this.ptpInstallments = resp;
          } else {
            this.ptpInstallmentsErr = true;
          }
        },
        error => this.ptpInstallmentsErr = true);
    }
  }

  setBillingHeaderPTPMessage() { // called on ngInit
    const ptpID = this.billingService.getPTPIDForHeader(this.allPtpInfo);
    this.ptpService.getPTPInstallments(ptpID).subscribe(
      (resp: any) => {
        if (resp.installments && resp.installments.length) {
          this.ptpInstallmentsHeader = resp;
        } else {
          this.ptpInstallmentsHeaderErr = true;
        }
      },
      error => this.ptpInstallmentsHeaderErr = true);
  }

  setTranslations() {
    this.billingService.getBillType().subscribe(type => {
      const month = format(
        this.dateHandler.getCurrentCycleEndDate(this.billSelection.issue_date),
        'MMMM',
        this.language === 'fr' ? { ...{ locale: fr } } : {}
      );
      if (type === 'E_BILL') {
        this.billMessage = this.translate.instant('billNotificationForOnlineBillNoEmail').replace('{{monthName}}', month);
      } else {
        this.billMessage = this.translate.instant('billNotificationForPaperBill').replace('{{monthName}}', month);
      }
    });
  }

  downloadBillAs(type: string) {
    this.dialog.open(LoadingComponent, this.dialogOptionsError);
    this.fetchResource(type).subscribe();
  }

  fetchResource(type) {
    return this.billingService.getEncryptedString().pipe(
      mergeMap(encrypt =>
        this.billingService.fetchUserBill(this.billSelection, this.accountNumber, type, encrypt).pipe(
          tap(content => {
            this.dialog.close();
            if (content.error) {
              this.dialog.open(BillingDownloadFailureComponent, { data: type });
            } else {
              this.billingService.downloadFile(
                this.billSelection.content_id,
                content,
                `Rogers-${this.billSelection.issue_date}-${this.accountNumber}-Usage.${type}`
              );
              this.dialog.open(BillingDownloadSuccessComponent, { data: type });
            }
          })
        )
      )
    );
  }

  /** Refactor this later */
  printPDF() {
    this.dialog.open(LoadingComponent, this.dialogOptionsError);
    this.billingService.getEncryptedString().subscribe(encryptStr => {
      try {
        const iFramePrintFile = document.getElementById('iFramePrintFile');
        iFramePrintFile.focus();
        this.dialog.close();
        iFramePrintFile.onload = () => {
          const result = (<any>iFramePrintFile).contentWindow.document.execCommand('print', false, null);
          if (!result) {
            (<any>iFramePrintFile).contentWindow.print();
          }
        };
        this.printPDFSrc = this.sanitize.bypassSecurityTrustResourceUrl(
          this.billingService.resolveIFrameUrl(this.billSelection.link, encryptStr, false)
        );
      } catch {
        this.dialog.open(ProfileErrorComponent, { data: { content: this.translate.instant('error_print_msg') } });
      }
    });
  }

  savePDF() {
    this.dialog.open(LoadingComponent, this.dialogOptionsError);
    this.billingService.getEncryptedString().subscribe(encryptStr => {
      try {
        const url = this.billingService.resolveIFrameUrl(this.billSelection.link, encryptStr, true);
        window.open(url, '_blank');
        this.dialog.close();
      } catch {
        this.dialog.open(ProfileErrorComponent, { data: { content: this.translate.instant('error_print_msg') } });
      }
    });
  }

  setIframeHeight(e: Event) {
    const frame = this.iFrameBill && this.iFrameBill.first.nativeElement;

    if (frame && frame.contentDocument && frame.contentDocument.body) {
      const initialHeight = frame.contentDocument.body.scrollHeight;
      frame.style.height = initialHeight + 45 + 'px';
      let timesRun = 0;

      // Poll iframe height for change
      const poll =
        frame &&
        setInterval(() => {
          timesRun += 1;
          if (timesRun > 5) {
            clearInterval(poll);
          } else {
            if (frame && frame.contentDocument && frame.contentDocument.body) {
              const newHeight = frame.contentDocument.body.scrollHeight;
              // If height changes after content load then update the height
              if (newHeight > initialHeight) {
                frame.style.height = newHeight + 45 + 'px';
              }
            }
          }
        }, 500);
    } else {
      console.log('Error accessing iframe');
    }
  }

  schedulePTPHistoryClicked($event) {
    this.defaultTab = 'schedule-ptp';
  }

  ptpLinkSelected(event) {
    this.ptpService.checkPendingPTP().subscribe((resp: any) => {
      const pendingPtpData = {
        pending: true,
        amount: this.billingDetails.balanceAmount,
        details: resp.ptpPaymentInfo
      };

      resp.ptpPendingIndicator ? this.dialog.open(SchedulePtpFailureDialogComponent, {data: pendingPtpData}) :
        this.checkEligibility();
    },
    (e) => {this.openSystemError(e); });
  }

  checkEligibility() {
    this.ptpService.checkPTPElgibility().subscribe((resp: any) => {
      const eligErrorData = {
        pending: false,
        amount: this.billingDetails.balanceAmount,
        errorList: resp.inEligibleReasonCodes
      };

      resp.isPTPEligible ? this.showSchedulePtp() :
        this.dialog.open(SchedulePtpFailureDialogComponent, {data: eligErrorData});
    },
    (e) => {this.openSystemError(e); });
  }

  showSchedulePtp() {
    this.ptpService.getNovaLinks().subscribe((resp: any) => {
      const novaLinks = this.commonData.language === 'fr' ? resp.ptp.fr : resp.ptp.en;

      const dialog: any = this.dialog.open(SchedulePtpDialogComponent, { data:
        {
          amount: this.billingDetails.balanceAmount,
          novaLinks: novaLinks
        }});
       dialog.submitPTP$.subscribe(formData => { this.savePtp(formData); });
    },
    (e) => {this.openSystemError(e); });
  }

  savePtp(formData) {
    const scheduleSuccessData = {
      title: this.translate.instant('promiseToPay.scheduleSuccessTitle'),
      content: this.translate.instant('promiseToPay.scheduleSuccessContent')
    };

    this.ptpService.schedulePTP(formData).subscribe((resp: any) => {
      resp.status ? this.dialog.open(SuccessComponent, {data: scheduleSuccessData}) :
        this.openSystemError();
    },
    (e) => {this.openSystemError(e); });
  }

  openSystemError(err?) {
    const genericErrorData = {
      content: this.translate.instant('somethingWentWrongContent'),
      error: this.translate.instant('somethingWentWrongTitle')
    };
    this.dialog.open(ErrorComponent, {data: genericErrorData});
  }

  handleError(e) {
    if (e.error) {
      this.overlayStatus = 'ERROR';
    }
  }
}
