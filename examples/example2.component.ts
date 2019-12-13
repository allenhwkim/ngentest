import {Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-example2',
  template: '',
  styleUrls: ['']
})
export class Example2Component implements OnInit {
  @Input('item') options: any = {};
  @Input('showFlow') set showFlow(show) {
    this.isFlow2 = show;
    this.getControlsAndCreateForm();
  }
  @Output() formSubmitted = new EventEmitter();
  @Output('inview') nguiInview: EventEmitter<any> = new EventEmitter();
  @Output('outview') nguiOutview: EventEmitter<any> = new EventEmitter();

  myForm: FormGroup;
  formControlsKeys: string[];
  amount: number;
  amountVal = 0;
  error = 'error';
  isValid: boolean;
  isFlow2: boolean;

  get myData() {
    let amount = this.data.tooltip.amount[this.language];
    const threshold = this.data.location.threshold;
    amount = amount ? amount.replace(/\[XXX]/gi, `$${threshold}.00`) : '';
    let tooltip = this.data.tooltip.site[this.language];
    tooltip = tooltip ? tooltip.replace(/\[XXX]/gi, `$${threshold}.00`) : '';
    const sites = this.data.location.sites;
    return { amount, siteToolTip, sites };
  }

  constructor(
    private formBuilder: FormBuilder,
    @Inject(LOCALE_ID) private language
  ) {}

  ngOnInit() {
    typeof this.isFlow2 !== 'boolean' ? this.createForm() : null;
  }

  createForm(controls) {
    controls = this.isFlow2 ? this.getControls() : this.getFormControls();
    this.createForm(controls);
    this.myForm = this.formBuilder.group(controls);
    if (!this.isFlow2) {
      this.handleFoo();
      this.handleBar();
    }
  }

  getFormControls() {
    const defaultControlKeys = ['foo', 'bar', 'baz'];
    switch (this.selectedType.code) {
      case 'foo':
        this.formControlsKeys = [...defaultControlKeys, 'foo', 'bar'];
        break;
      default:
        this.formControlsKeys = defaultControlKeys;
    }
    return this.getControls();
  }

  getControls() {
    const allControls = {};
    const notRequiredFields = ['fuz', 'baz'];
    this.formControlsKeys.forEach(key => {
      const validations = !notRequiredFields.includes(key) ? Validators.required : '';
      allControls[key] = ['', validations];
    });
    return allControls;
  }

  handleBar() {
    const thresholdAmount = Number(this.data.location.threshold);
    this.myForm.get('amount').valueChanges.subscribe(amount => {
      this.amount = Number(amount);
      this.valid = this.isValid();
      this.handleFoo(thresholdAmount);
    });
  }

  handleFoo() {
    const fooControl = this.myForm.get('foo');
    if (fooControl) {
      this.myForm.get('foo').valueChanges.subscribe(fooValue => {
        const fee = this.details.content.moreDetails.plan;
        this.amount = fooValue * (fee / 99);
        this.myForm.get('foo').setValue(this.amount, {only: true});
      });
    }
  }

  getAmount() {
    if (this.amountVal > Number(this.data.amount) && !this.selected.id) {
      this.error = '1';
      return false;
    } else if (this.foo && this.amountVal > this.data.amount2) {
      this.error = '2';
      return false;
    } else if (!this.myForm.get('amount').valid) {
      this.error = '3';
      return false;
    }
    return true;
  }

  handleFoo(amount) {
    this.showFoo = this.amountVal > amount && !this.isValid;
    this.showFoo ? this.myForm.get('foo').enable() : this.myForm.get('foo').disable();
  }

  isFieldValid(formControl) {
    return formControl.touched && !formControl.valid;
  }

  isValid() {
    if (!this.isFlow2) {
      return !this.getAmount();
    }
  }

  submit() {
    this.formSubmitted.emit(this.myForm.value);
  }

}
