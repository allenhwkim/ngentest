import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { OneviewPermissionService } from '@rogers/oneview-components';

import { ShareEverythingDataService } from '@rogers/oneview-components';
import { CommonDataService } from '@rogers/oneview-components';
import { DialogService } from '@rogers/oneview-components';

import { DashboardDataService } from './dashboard-data.service';
import { ProcessHupService } from './hup/process-hup.service';
import { NavigationService } from '../framework/navigation.service';
import { AppDataService } from '../app-data.service';
import { ServiceSubTypes } from './service-subtypes.service';
import { AdditionalServicesDialogComponent } from './additional-services-dialog.component';
import { DealerCodeDialogComponent } from './dealercode/dealer-code-dialog.component';
import { DealerCodeService } from './dealercode/dealer-code.service';
import { ActionsService } from '../actions/actions.service';
import { ChangePlanComponent } from './app-change-plan/change-plan.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: [`./dashboard.scss`]
})
export class DashboardComponent implements OnInit {
  accountNumber: any;
  accountSummary: any;
  serviceSubTypes: any;
  idvSummary = { info: {}, caseID: 5 };
  userPreferences: any;
  subscriptionSummary: any = { subscriptionDetails: [{ pricePlanDetails: {} }] };
  @ViewChild('dashboardFirstColumn', {read: ElementRef}) dashboardFirstColumn: ElementRef;
  @ViewChild('interactionList', {read: ElementRef}) interactionList: ElementRef;
  @ViewChild('actionOffers', {read: ElementRef}) actionOffers: ElementRef;
  @ViewChild('additionalServicesModal', {read: ElementRef}) additionalServicesModal: ElementRef;
  @ViewChild(ChangePlanComponent) changePlan: ChangePlanComponent;

  constructor(
    private commonData: CommonDataService,
    private shareEverythingService: ShareEverythingDataService,
    private ramPermissionService: OneviewPermissionService,
    private appData: AppDataService,
    private el: ElementRef,
    private dashboardData: DashboardDataService,
    private processHup: ProcessHupService,
    private svcSubTypes: ServiceSubTypes,
    private dialogService: DialogService,
    public navigationService: NavigationService,
    private actionService: ActionsService,
    private dealerCodeService: DealerCodeService
  ) {
    this.accountNumber = commonData.accountNumber;  // Patch fix to send account number in Preapproval & Subscription/summary request
    this.accountSummary = commonData.accountSummary;
    this.serviceSubTypes = svcSubTypes.getServiceSubTypes();
  }

  hasShareEverything: boolean;
  isCableOnly: boolean;
  preApproved: boolean;
  shareEverythingData: any;
  interactionsDetails: any;
  dispositionErr: any;
  dispositionStatus: any;
  postDatedPPC: any;
  postDatedPPCErr: boolean;
  treatmentErr: any;
  activeTreatments: any;
  interactionErr: boolean;
  billingDetails: any;
  viewHeight: any;
  showAdditionalServiceLink: any = {internet: true, tv: true, homePhone: true, shm: true, ignite: true};

  get isAccountHolder(): boolean {
    return this.commonData.agentInfo['consumer'] &&
      this.commonData.agentInfo.authorizationLevel &&
      this.commonData.agentInfo.authorozationLevel.toUpperCase() === 'ACCOUNT_HOLDER';
  }

  ngOnInit() {
    this.isCableOnly = this.accountSummary.lob === 'C';
    this.dashboardData.getBillingDetails()
      .subscribe (
        resp => this.billingDetails = resp
      );
    this.dashboardData.getPostDatedPPC()
      .subscribe(
        resp =>  this.postDatedPPC = resp,
        error => this.postDatedPPCErr = true
      );
    this.appData.getIDVSummary$.subscribe(resp => this.idvSummary = resp);
    // show shareverything section first before we get subscription summary
    this.shareEverythingData =
    this.shareEverythingService.getShareEverythingData(this.accountSummary, this.subscriptionSummary);
    this.dashboardData.getInteractions()
      .subscribe(
        resp => this.interactionsDetails = resp,
        error => this.interactionErr = true
      );
    this.dashboardData.getSubscriptionsSummary(this.accountNumber, 'UTERogersCare')
      .subscribe(resp => {
        this.subscriptionSummary = resp;
        this.shareEverythingData = this.shareEverythingService.getShareEverythingData(this.accountSummary, resp);
        this.hasShareEverything = !!this.shareEverythingData.planName;
      });

    this.showAdditionalServiceLink = this.dashboardData.getAdditionalServiceLinks();

    this.actionService.getActiveTreatments().subscribe(
      activeTreatments => {
        this.activeTreatments = activeTreatments;
        this.actionService.getDispositionStatus(this.activeTreatments.ecid).subscribe(
          resp => this.dispositionStatus = resp,
          error => this.dispositionErr = true
        );
      },
      error => this.treatmentErr = this.dashboardData.handleTreatmentsDataError(error)
    );

  }

  updateHeight(event) {
    setTimeout(() => {
      this.viewHeight = this.dashboardFirstColumn.nativeElement.offsetHeight;
      this.interactionList.nativeElement.style.height = this.viewHeight + 'px';
      this.actionOffers.nativeElement.style.height = this.viewHeight + 'px';
    }, 500);
  }

  openAdditionalServiceModal(dialogType) {
    this.dialogService.open(AdditionalServicesDialogComponent, {data: dialogType});
  }

  async startPPCFlow(event) {
    const dealerCode = this.commonData.agentInfo.dealerCode;
    const allowedDCAccess = this.ramPermissionService.isPermitted('DealerCode', 'update');

    if (allowedDCAccess && !dealerCode) {
      const dialog = this.dialogService.open(DealerCodeDialogComponent, {
        data: {state: 'success'}
      });
      dialog.dealerCodeChange$.subscribe(async newDealerCode => {
        const isDealerCodeUpdated = await this.dealerCodeService.checkIfDealerCodeUpdated(newDealerCode);
        if (isDealerCodeUpdated) {
          this.changePlan.changePricePlan();
        }
      }
      );
    } else {
      this.changePlan.changePricePlan();
    }
  }

  async handleBuyflow(event) {
    const dealerCode = this.commonData.agentInfo.dealerCode;
    const selectedCtn = event.detail.ctn;
    const accountNumber = this.commonData.accountSummary.accountNumber;
    const allowedDCAccess = this.ramPermissionService.isPermitted('DealerCode', 'update');

    if (allowedDCAccess && !dealerCode) {
      const dialog = this.dialogService.open(DealerCodeDialogComponent, {
        data: {state: 'success'}
      });
      dialog.dealerCodeChange$.subscribe(newDealerCode =>
        this.processHup.handleDealerCodeChange(newDealerCode, accountNumber, selectedCtn) //
      );
    } else {
      const isEligible = await this.processHup.checkEligibility(accountNumber, selectedCtn);
      isEligible && this.processHup.upgradeHardware(accountNumber, selectedCtn);
    }
  }

  goToIgniteTV(event) {
    this.el.nativeElement.dispatchEvent(new CustomEvent('navigate-to', {
      detail: 'getIgniteTv',
      bubbles: true
    }));
  }
}
