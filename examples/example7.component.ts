import { Component } from '@angular/core';
import { DialogService } from '@rogers/oneview-components';
import { ChangePlanDialogComponent } from './change-plan-dialog.component';
import { ChangePlanIndividualDialogComponent } from './change-plan-individual-dialog.component';
import { NavigationService } from './../../framework/navigation.service';
import { ChangePlanDataService } from './change-plan-data.service';

@Component({template: '', selector: 'app-change-plan'})

export class ChangePlanComponent {
  statePostData = {
    ctn: null,
    eligibilityChecked: false,
    selectAdditionalSubscribers: '',
    filterOption: 'all',
    availableCreditAmount: null
  };
  eligiblePostData = {
    subNumber: null,
    flowType: null
  };
  targetPath: any;

  constructor(
    public dialog: DialogService,
    private changePlanData: ChangePlanDataService,
    private navigation: NavigationService) {
  }

  // ENTRYPOINT
  async changePricePlan() {
    const primaryPhoneNumber = this.changePlanData.getPrimaryPhoneNumber();
    const ppcSubscribers: any = await this.changePlanData.getPPCSubscribers().toPromise();
    if (!ppcSubscribers) {
      return;
    }
    const singleOrMulti = ppcSubscribers && this.changePlanData.checkifMultiorSingle(ppcSubscribers);

    if (singleOrMulti === 'multi') {
      const activeSubs = this.changePlanData.getActiveSubs(ppcSubscribers);
      const primaryNumberShareStatus = this.changePlanData.getPrimaryNumberShareStatus(activeSubs);

      if (primaryNumberShareStatus === 'Main') {
        const hasActiveAdditional = this.changePlanData.hasActiveAdditionalSubs(activeSubs);
        const flowType = hasActiveAdditional ? 'multi' : 'single';
        this.targetPath = flowType === 'multi' ? 'ChangeSharePlan' : 'ChoosePlan';
        this.setEligibilityAndStatePostData({subNumber: primaryPhoneNumber, filterOption: 'all', flowType});

      } else if (primaryNumberShareStatus === 'Additional') {
        const mainSub = this.changePlanData.getMainSub(activeSubs);
        this.setEligibilityAndStatePostData({subNumber: mainSub.subscriberNumber, filterOption: 'main', flowType: 'multi'});
        this.targetPath = 'ChangeSharePlan';

      } else if (primaryNumberShareStatus === 'Individual') {
        const data: any = await this.getIndividualSubPostData(activeSubs, primaryPhoneNumber);
        this.setEligibilityAndStatePostData(data);
        this.targetPath = data.targetPath;
      }
    } else if (singleOrMulti === 'single') {
      const singleSubNumber = this.changePlanData.getSingleSubNumber(ppcSubscribers);
      this.targetPath = 'ChoosePlan';
      this.setEligibilityAndStatePostData({subNumber: singleSubNumber, filterOption: 'all', flowType: 'single'});
    }
    const isEligible = await this.getEligibility(this.eligiblePostData.subNumber, this.eligiblePostData.flowType);

    if (isEligible === true) {
      this.statePostData.eligibilityChecked = true;
      this.saveStateAndChangePlan();
    }
  }

  async getEligibility(subNumber, flowType) {
    const subEligibliityResp: any = await this.changePlanData.getPPCEligibility(subNumber, flowType).toPromise();
    if (subEligibliityResp) {
      if (subEligibliityResp.eligible) {
        const isBOTEligible = await this.checkIfBOTEligible(subEligibliityResp);
        return isBOTEligible;
      } else if (subEligibliityResp.eligible === false) {
        this.dialog.open(ChangePlanDialogComponent, {data: {
          dialogToShow: 'eligibility-error',
          errorCode: this.changePlanData.formatEligibilityErrorCode(subEligibliityResp.eligibilityCode)
        }});
      }
      return false;
    }
  }

  async checkIfBOTEligible(subEligibliityResp) {
    this.statePostData.availableCreditAmount = subEligibliityResp.availableCreditAmount;

    const getCases: any = await this.changePlanData.getCases().toPromise();
    const pendingCases = getCases && this.changePlanData.getPendingCases(getCases);

    if (pendingCases && pendingCases.length > 0) {
      const caseID = pendingCases[0].caseID; // todays functionality is only picking one case ID even though there could be more
      const dialog: any = this.dialog.open(ChangePlanDialogComponent, {data: { dialogToShow: 'bot-ineligible' }});

      dialog.processCloseCase$.subscribe(async resp => {
        const closedCase: any = await this.changePlanData.closeCase(caseID).toPromise();
        if (closedCase && closedCase.responseHeader && closedCase.responseHeader.status === 'success') {
          const closeCaseDialog: any = this.dialog.open(ChangePlanDialogComponent, {data: { dialogToShow: 'close-case-success' }});
          closeCaseDialog.saveStateAndChangePlan$.subscribe(closeCaseResp => this.saveStateAndChangePlan());
        }
      });
      return false;
    }
    return true;
  }

  async saveStateAndChangePlan() {
    const savePPCResp = await this.changePlanData.savePPCState(this.statePostData).toPromise();
    savePPCResp && this.navigation.changeRoute({detail: this.targetPath});
  }

  async getIndividualSubPostData(activeSubs, primaryPhoneNumber) {
    const hasActiveMain = this.changePlanData.hasActiveMain(activeSubs);
    const hasOtherIndividualSubs =  this.changePlanData.hasOtherIndividualSubs(activeSubs);
    const promiseFunc = (resolve, reject) => {
      const getIndSubPostData =  this.changePlanData.getIndSubPostData;  // DRY
      if (hasActiveMain) {
        const mainSub = this.changePlanData.getMainSub(activeSubs);
        const hasActiveMainDialog: any = this.dialog.open(ChangePlanDialogComponent, {});
        const selectAdditionalSubscribers = this.changePlanData.getActiveAdditionalSubsWithPrimary(activeSubs);
        // user chose to only make changes to individual line
        hasActiveMainDialog.proceedWithExistingPlan$.subscribe(resp => {
          const payLoadExistingPlan = getIndSubPostData('ChoosePlan', primaryPhoneNumber, '');
          resolve (payLoadExistingPlan);
        });
        // user chose to add individual line to shared plan and wants to add data
        hasActiveMainDialog.proceedToAddData$.subscribe(resp => {
          const payLoadAddData = getIndSubPostData('ChooseSharePlan', mainSub.subscriberNumber, selectAdditionalSubscribers);
          resolve (payLoadAddData);
        });
        // user chose to add individual line to shared plan and doesnt want to add data
        hasActiveMainDialog.proceedToNotAddData$.subscribe(resp => {
          const payLoadNotAddData = getIndSubPostData('AdditionalLineOptions', mainSub.subscriberNumber, selectAdditionalSubscribers);
          resolve (payLoadNotAddData);
        });

      } else if (hasOtherIndividualSubs) {
          const otherIndividualSubs = this.changePlanData.getOtherIndividualSubs(activeSubs);
          const hasOtherIndividualSubDialog: any = this.dialog.open(ChangePlanIndividualDialogComponent,
            {data: { individualSubs: otherIndividualSubs, primaryPhoneNumber: primaryPhoneNumber }});
          // user chose to only make changes to individual line
          hasOtherIndividualSubDialog.makeChangesToYourCurrentPlan$.subscribe(resp => {
            const makeChangesToCurrentPlanPayload = getIndSubPostData('ChoosePlan', primaryPhoneNumber, '');
            resolve (makeChangesToCurrentPlanPayload);
          });
          // user chose to create shared plan from individual lines
          hasOtherIndividualSubDialog.createASharedPlanWithYourOtherLines$.subscribe(resp => {
            const createASharedPlanWithYourOtherLinesPayLoad = getIndSubPostData('ChooseSharePlan',
              resp.ctn, resp.selectAdditionalSubscribers);
            resolve (createASharedPlanWithYourOtherLinesPayLoad);
          });

      } else {
        const onlySingleIndPayLoad = getIndSubPostData('ChoosePlan', primaryPhoneNumber, '');
        resolve (onlySingleIndPayLoad);
      }
    };

    return new Promise(promiseFunc);
  }

  private setEligibilityAndStatePostData(data) {
    const valuesToSet = {
      ctn: data.subNumber,
      subNumber: data.subNumber,
      flowType: data.flowType,
      filterOption: data.filterOption,
      selectAdditionalSubscribers: data.selectAdditionalSubscribers || ''
    };
    for (const x of Object.keys(valuesToSet)) { this.eligiblePostData[x] = valuesToSet[x]; }
    for (const x of Object.keys(valuesToSet)) { this.statePostData[x] = valuesToSet[x]; }
  }

}
