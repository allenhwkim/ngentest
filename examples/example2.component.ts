import {Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';


@Component({
  selector: 'app-adjustment-form',
  template: '',
  styleUrls: ['']
})

export class AdjustmentFormComponent implements OnInit {
  @Input('item') options: any = {};
  @Input('showAutomaticAdjustmentFlow')
  set showAutomaticAdjustmentFlow(isAutomatic) {
    this.isAutomaticFlow = isAutomatic;
    this.getControlsAndCreateForm();
  }
  @Output() formSubmitted = new EventEmitter();
  @Output('inview') nguiInview: EventEmitter<any> = new EventEmitter();
  @Output('outview') nguiOutview: EventEmitter<any> = new EventEmitter();

  adjustmentForm: FormGroup;
  formControlsKeys: string[];
  adjustmentAmountVal = 0;
  adjustmentAmountErrorMsg = 'Please enter an amount';
  currentLanguage: string;
  showSiteField = false;
  recommendedAmount: number;
  isAdjustmentFieldInValid: boolean;
  isAutomaticFlow: boolean;
  get me(): Number {
    return 123;
  }

  constructor(private formBuilder: FormBuilder, @Inject(LOCALE_ID) private language) {
  }

  get toolTipDescAndSites() {
    let amountToolTip = this.adjustmentsDetailsCms.tooltip.amount[this.currentLanguage];
    const threshold = this.adjustmentsDetailsCms.location.threshold;
    amountToolTip = amountToolTip ? amountToolTip.replace(/\[XXX]/gi, `$${threshold}.00`) : '';
    let siteToolTip = this.adjustmentsDetailsCms.tooltip.site[this.currentLanguage];
    siteToolTip = siteToolTip ? siteToolTip.replace(/\[XXX]/gi, `$${threshold}.00`) : '';
    const sites = this.adjustmentsDetailsCms.location.sites;
    return {
      amountToolTip, siteToolTip, sites
    };
  }

  ngOnInit() {
    this.currentLanguage = this.language ? this.language : 'en';
    // Added below line in case showAutomaticAdjustmentFlow input is not passed, then by default non automatic flow will be shown
    typeof this.isAutomaticFlow !== 'boolean' ? this.getControlsAndCreateForm() : null;
  }

  getControlsAndCreateForm() {
    const controls = this.isAutomaticFlow ? this.getAutomaticFlowFormControls() : this.getSpecificFormControls();
    this.createForm(controls);
  }

  createForm(controls) {
    this.adjustmentForm = this.formBuilder.group(controls);
    if (!this.isAutomaticFlow) {
      this.handleDaysAffected();
      this.handleAdjustmentValueChange();
    }
  }

  getAutomaticFlowFormControls() {
    this.formControlsKeys = ['notes'];
    return this.getControls();
  }

  getSpecificFormControls() {
    const defaultControlKeys = ['adjustmentAmount', 'adjustmentReason', 'siteLocation'];
    switch (this.selectedAdjustmentType.code) {
      case 'policyadjustment': // can be removed, keeping it in case some more dynamic case is there
        this.formControlsKeys = defaultControlKeys;
        break;
      case 'servicenetworkissue':
        this.formControlsKeys = [...defaultControlKeys, 'daysAffected'];
        break;
      case 'systemerrors': // can be removed, keeping it in case some more dynamic case is there
        this.formControlsKeys = defaultControlKeys;
        break;
      case 'documentederrororpromise':
        this.formControlsKeys = [...defaultControlKeys, 'interactionId', 'employeeId'];
        break;
      default:
        this.formControlsKeys = defaultControlKeys;
    }
    return this.getControls();
  }

  getControls() {
    const allControls = {};
    const notRequiredFields = ['daysAffected', 'notes'];
    this.formControlsKeys.forEach(key => {
      const validations = !notRequiredFields.includes(key) ? Validators.required : '';
      allControls[key] = ['', validations];
    });
    return allControls;
  }

  handleAdjustmentValueChange() {
    const thresholdAmount = Number(this.adjustmentsDetailsCms.location.threshold);
    this.adjustmentForm.get('adjustmentAmount').valueChanges.subscribe(adjustmentAmountVal => {
      this.adjustmentAmountVal = Number(adjustmentAmountVal);
      this.isAdjustmentFieldInValid = this.adjustmentFieldInValidation();
      this.handleSiteField(thresholdAmount);
    });
  }

  handleDaysAffected() {
    const daysAffectedFormControl = this.adjustmentForm.get('daysAffected');
    if (daysAffectedFormControl) {
      this.adjustmentForm.get('daysAffected').valueChanges.subscribe(daysAffectedValue => {
        const monthlyServiceFee = this.wirelessPostpaidDetails.content.postPaidPhoneDetails.planMSF;
        this.recommendedAmount = daysAffectedValue * (monthlyServiceFee / 30);
        this.adjustmentForm.get('adjustmentAmount').setValue(this.recommendedAmount, {onlySelf: true});
      });
    }
  }

  getValidationAndSetSpecificErrorsForAmount() {
    if (this.adjustmentAmountVal > Number(this.adjustmentsDetailsCms.nextBillMaxAmount) && !this.selectedBill.content_id) {
      this.adjustmentAmountErrorMsg = 'Amount cannot exceed $50';
      return false;
    } else if (this.adjustmentAmountVal > Number(this.adjustmentsDetailsCms.adjustmentMaxAmount)) {
      this.adjustmentAmountErrorMsg = 'Amount exceeds authorized limit. Please see team manager to apply.';
      return false;
    } else if (this.selectedCharge && this.adjustmentAmountVal > this.selectedCharge.adjustableAmount) {
      this.adjustmentAmountErrorMsg = 'Amount exceeds authorized limit. Please see team manager to apply.';
      return false;
    } else if (!this.adjustmentForm.get('adjustmentAmount').valid) {
      this.adjustmentAmountErrorMsg = 'Please enter an amount';
      return false;
    }
    return true;
  }

  handleSiteField(thresholdAmount) {
    this.showSiteField = this.adjustmentAmountVal > thresholdAmount && !this.isAdjustmentFieldInValid;
    this.showSiteField ? this.adjustmentForm.get('siteLocation').enable() : this.adjustmentForm.get('siteLocation').disable();
  }

  isFieldValid(formControl) {
    return formControl.touched && !formControl.valid;
  }

  adjustmentFieldInValidation() {
    if (!this.isAutomaticFlow) {
      return !this.getValidationAndSetSpecificErrorsForAmount();
    }
  }

  submit() {
    this.formSubmitted.emit(this.adjustmentForm.value);
  }

}
