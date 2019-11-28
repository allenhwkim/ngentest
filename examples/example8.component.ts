import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CreditManagementService} from './credit-management.service';
import {CreditManagementDataService} from './credit-management-data.service';
import {DialogService, ErrorComponent, InteractionCreatedComponent} from '@rogers/oneview-components';
import {TranslateService} from '@ngx-translate/core';
import {NavigationService} from '../framework/navigation.service';

@Component({
  selector: 'app-credit-management',
  templateUrl: './credit-management.component.html',
  styleUrls: ['./credit-management.component.scss']
})
export class CreditManagementComponent implements OnInit {
  data: any;
  accountOverviewSummary: any;
  accountOverviewBillingDetails: any;
  wirelessPostpaidDetails: any;
  recentAdjustments: any;
  adjustmentTypes: any;
  activatedUserSummary: any;
  adjustmentCharges: any;
  selectedService: any;
  selectedBill: any;
  selectedCharge: any;
  selectedAdjustment: any;
  existingIssueSelected: any;
  adjustmentsDetailsCms: any;
  manualIssueNumber: string;
  chargeErrorMessage: string;
  readyForAdjustmentForm = false;
  isTransactionServiceSelected = false;
  hideChargeBlock = false;
  showAutomaticAdjustmentFlow = false;
  isIssueNotFoundShown = false;
  showLoader = false;

  constructor(private creditManagementService: CreditManagementService, private dialog: DialogService,
              private translate: TranslateService, private creditManagementDataService: CreditManagementDataService,
              private navigation: NavigationService, private router: Router) {}

  async ngOnInit() {
    try {
      this.data = await this.creditManagementService.getAccountSummaryAndBillingDetails().toPromise();
      this.accountOverviewSummary = this.data[0];
      this.accountOverviewBillingDetails = this.data[1];
    } catch (e) {this.openSystemError(e); }
  }

  resetValues(dontResetAdjustment?) {
    this.selectedBill = null;
    this.selectedCharge = null;
    this.readyForAdjustmentForm = null;
    this.existingIssueSelected = null;
    this.adjustmentCharges = null;
    this.hideChargeBlock = false;
    this.selectedAdjustment = dontResetAdjustment ? this.selectedAdjustment : null;
  }

  resetAllFields() {
    this.resetValues();
    this.selectedService = null;
    this.wirelessPostpaidDetails = null;
    this.recentAdjustments = null;
  }

  async servicePlanChanged(selectedService) {
    this.resetAllFields();
    if (selectedService) {
      try {
        this.showLoader = true;
        this.wirelessPostpaidDetails = await this.creditManagementService.getWireLessPostpaidDetails(selectedService).toPromise();
        this.recentAdjustments = await this.creditManagementService.getRecentAdjustments(selectedService).toPromise();
        this.setAdjustmentTypesAndBills();
        this.selectedService = selectedService;
      } catch (e) {this.openSystemError(e); }
    }
  }

  async setAdjustmentTypesAndBills() {
    try {
      this.adjustmentTypes = await this.creditManagementService.getAdjustmentTypes().toPromise();
      this.activatedUserSummary = await this.creditManagementService.loadUserBill().toPromise();
      this.showLoader = false;
    } catch (e) {
      this.adjustmentTypes = null;
      this.showLoader = false;
      this.openSystemError(e);
    }
  }

  adjustmentTypeChanged(selectedAdjustment) {
    this.resetValues();
    this.selectedAdjustment = selectedAdjustment;
    this.isTransactionServiceSelected = selectedAdjustment.code === 'documentederrororpromise';
    this.isIssueNotFoundShown = ['servicenetworkissue', 'systemerrors'].includes(selectedAdjustment.code);
  }

  async billingCycleChanged(selectedBill) {
    this.resetValues(true);
    this.selectedBill = selectedBill;
    this.hideChargeBlock = selectedBill === 'nextBill';
    !this.hideChargeBlock ? this.setCharges() : null;
    try {
      this.adjustmentsDetailsCms = this.adjustmentsDetailsCms ? this.adjustmentsDetailsCms :
        await this.creditManagementService.getAdjustmentCmsDetails().toPromise();
    } catch (error) {
      this.selectedBill = null;
      this.openSystemError(error);
    }
  }

  async setCharges() {
    this.creditManagementService.getAdjustmentCharges(this.selectedService, this.selectedBill).subscribe(
      resp => this.adjustmentCharges = resp,
      httpError => {
        const businessErrorStatusCode = (httpError.error || {}).statusCode;
        // this is legacy data structure for statusCode
        // const isBusinessError = error.data && error.data.data && error.data.data.statusCode;
        if (businessErrorStatusCode === 560) {
          this.chargeErrorMessage = 'Charges not applicable for this bill cycle';
        } else {
          this.openSystemError(httpError);
        }
      }
    );
  }

  async handleChargeSelected(selectedCharge) {
    this.readyForAdjustmentForm = null;
    this.selectedCharge = selectedCharge;
  }

  async handleIssueChanged(selectedIssue) {
    if (selectedIssue.issueSelected || selectedIssue.newInputEntered || selectedIssue.isOpenOrClosed === 'opened') {
      this.readyForAdjustmentForm = true;
      this.existingIssueSelected = selectedIssue.issueSelected;
      this.showAutomaticAdjustmentFlow = this.existingIssueSelected && this.existingIssueSelected.autoAdjustment === 'No-Automatically';
      this.manualIssueNumber = selectedIssue.newInputEntered;
    } else {
      this.readyForAdjustmentForm = false;
    }
  }

  showAdjustmentForm() {
    return (this.readyForAdjustmentForm || this.isTransactionServiceSelected) &&
      this.adjustmentsDetailsCms && (this.selectedCharge || this.hideChargeBlock);
  }

  async formSubmitted(formValues) {
    if (this.showAutomaticAdjustmentFlow) {
      try {
        await this.creditManagementDataService.setDataAndCreateInteraction(this.selectedAdjustment, this.existingIssueSelected,
          formValues, this.selectedService).toPromise();
        this.openInteractionOrSubmitModal();
      } catch (e) {this.openSystemError(e); }
    } else {
      this.submitCreditManagement(formValues);
    }
  }

  async submitCreditManagement(formValues) {
    // Creating payload only on Submit as user can keep on changing options so we don't have to keep on processing data on each change
    this.creditManagementDataService.setServiceAdjustmentAndBillData(this.selectedService, this.selectedAdjustment, this.selectedBill);
    this.creditManagementDataService.setChargeData(this.selectedCharge);
    this.creditManagementDataService.setIssueData(this.existingIssueSelected, this.manualIssueNumber, this.selectedAdjustment);
    this.creditManagementDataService.setFormData(formValues);
    this.creditManagementDataService.submitCreditManagement().subscribe(
      resp => this.openInteractionOrSubmitModal(true, formValues),
      httpError => {
        const businessErrorStatusCode = httpError.error && httpError.error.statusCode;
        if (businessErrorStatusCode === 560) {
          const title = 'Adjustment Incomplete';
          const content = 'Sorry, we are unable to submit this request because the adjustment sub-type and charge-type do not match. Please try again.';
          this.openSystemError(httpError, title, content);
        } else {
          this.openSystemError(httpError);
        }
      }
    );
  }

  openInteractionOrSubmitModal(showSubmittedFlow?, formValues?) {
    const dialog: any = this.dialog.open(InteractionCreatedComponent, {
      data: {
        adjustmentType: this.selectedAdjustment.name,
        amount: showSubmittedFlow ? formValues.adjustmentAmount : '0',
        adjustmentCodes: ['N/A'],
        showSubmittedFlow: showSubmittedFlow
      }});
    dialog.doneClicked.subscribe( () => {
      this.dialog.close();
      this.router.navigateByUrl(this.navigation.previousUrl);
    });
  }

  openSystemError(err?, title?, content?) {
    const genericErrorData = {
      content: this.translate.instant(content || 'somethingWentWrongContent'),
      error: this.translate.instant(title || 'somethingWentWrongTitle')
    };
    this.dialog.open(ErrorComponent, {data: genericErrorData});
  }

}
