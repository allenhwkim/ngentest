import { Component, Input, OnInit, Inject, LOCALE_ID, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { lastDayOfMonth, differenceInCalendarDays, isWithinInterval, isSameDay } from 'date-fns';

import { ComponentOne } from '../../payment';
import { ServiceOne } from '../payment.service';
import { ServiceTwo } from './billing-header.service';
import { ServiceThree } from '../../oneview-common/serviceThree/serviceThree.service';
import { ServiceFour } from 'src/app/billing/billing-page/billing-data.service';
import { defer, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './my.html',
  styleUrls: ['./my.scss']
})
export class Example3Component implements OnInit {
  @Input() details;
  @Input() myConfig;
  @Input() ssssMmmm;
  @Input() links = {
    link1: '/link',
    link2: '/link/link2',
    link3: '/link/link3',
    link4: '/link4'
  };
  @Input() myError = false;
  @Input() set iiiiPppp(data) {
    data = data || {};
    if (data) {
      this.myCount = data.count;
      this.upcomingDate = data.upcomingDate;
      this.myAmount = data.myAmount;
    }
  }
  @Input() myInfo$: Observable<{ myType: string; startDate: Date; endDate: Date }>;

  myMessage$ = defer(() => this.myInfo$).pipe(
    map(myInfo => {
      if (myInfo.myType && myInfo.startDate && myInfo.endDate) {
        return this.processThisDate(myInfo.myType, myInfo.startDate, myInfo.endDate);
      } else {
        return '';
      }
    })
  );

  myCount: any;
  upcomingDate: any;
  myAmount: any;

  _foo: string;
  fooNumber: string;

  fooCard: any;
  barCard: any;
  fooImg = '';

  fooBaz: Date;
  fooBazDate: string;
  isFooDddCcc: boolean;
  isFooEeeCcc = false;
  numDaysDone: number;

  isNotFoo: boolean;
  isXxxYyy: boolean;

  showFooXxx: boolean;
  showBarXxx = false;
  currentLanguage: any;

  cccNnnMsg: any;

  cccLllEee = false;
  aaaAaCccLll = false;
  NnnCcclll = false;
  cccUuu: any;
  cccLllWwwEee = false;

  constructor(
    private route: ActivatedRoute,
    private el: ElementRef,
    private serviceThree: ServiceThree,
    private bbbHhh: ServiceTwo,
    private serviceOne: ServiceOne,
    private serviceFour: ServiceFour,
    @Inject(LOCALE_ID) private language: string) {}

  ngOnInit() {
    const ccc = this.route.snapshot.params['ccc'];
    this.currentLanguage = this.language ? this.language : 'en';
    this.isXxxYyy = this.ssssMmmm.accountStatus.toUpperCase() === 'FOO';
    this.setNnnMmm();
    this._foo = this.details.OooPppMmm.tttMmm.toUpperCase();
    this.isNotFoo = this._foo !== 'R';

    if (this._foo === 'D') {
      this.setCccDddBbb();
    } else if (this._foo === 'C') {
      this.setFooDddCcc();
    }

    this.cccUuu = this.getcccUuu() || 0;
    this.cccLllWwwEee = this.isCccLllWwwSssIiii();
    this.serviceOne.getfooCardConfig().subscribe(config => (this.config = config));
    this.serviceFour
      .getFooing()
      .pipe(map((billing: any) => billing.OooPppMmm.tttMmm))
      .subscribe(tttMmm => (this.OooPppMmm = tttMmm));
  }

  setCccDddBbb() {
    this.barCard = this.details.OooPppMmm.chequingDetails;
    this.fooNumber = this.barCard.nnnAaaa;
  }

  setFooDddCcc() {
    const cardImg = {
      visa: 'assets/visa.png',
      master: 'assets/master.png',
      amex: 'assets/amex.png'
    };
    this.fooCard = this.details.OooPppMmm.fooCardDetails;
    if (this.fooCard && this.fooCard.ccType) {
      this.fooImg = cardImg[this.fooCard.ccType.toLowerCase()];
    }
    this.fooBaz = lastDayOfMonth(this.bbbHhh.getLocalDate(this.fooCard.fooBaz));
    this.fooBazDate = this.bbbHhh.formatDate(this.fooBaz, this.language);
    this.isFooDddCcc = this.bbbHhh.isFooDddCcc(this.fooBaz);
    this.isFooEeeCcc = !this.isFooDddCcc && this.bbbHhh.isFooEeeCcc(this.fooBaz);
    this.showFooXxx = this.isFooDddCcc || this.isFooEeeCcc;
    this.numDaysDone = this.isFooEeeCcc && differenceInCalendarDays(this.fooBaz, new Date());
  }

  openPpppCccc(type) {
    const date =
      this.details && this.details.dddDddBbb
        ? this.bbbHhh.formatDate(new Date(('' + this.details.dddDddBbb).replace('-', '/')), this.language)
        : null;

    const serviceThreeComponent = this.serviceThree.open(ComponentOne, {
      data: { ssssMmmm: this.ssssMmmm, type, date }
    });
    serviceThreeComponent.$tttCccMmmCcc.subscribe(res => res && (this.isNotFoo = false));
  }

  openPppSss(event) {
    event.stopPropagation();
    this.el.nativeElement.dispatchEvent(new CustomEvent('my-event1', {
      detail: {},
      bubbles: true
    }));
  }

  openPppSssHistory(event) {
    event.stopPropagation();
    this.el.nativeElement.dispatchEvent(new CustomEvent('my-event2', {
      detail: {},
      bubbles: true
    }));
  }

  processThisDate(myType, startDate, endDate): string {
    const currentDate = new Date();
    this.showBarXxx =
      isWithinInterval(currentDate, {
        start: startDate,
        end: endDate
      }) || isSameDay(currentDate, startDate);

    if (this.showBarXxx) {
      if (!this.isNotFoo && myType !== 'E_BILL') {
        return 'Set up Online Billing and Auto Pay';
      }
    } else {
      return '';
    }
  }

  setNnnMmm() { // utilizing retail logic for care
    if (this.myConfig) {
      const { startDate, endDate } = this.getStartEndDates(this.myConfig);
      const myType = this.details.myType ? this.details.myType : 'error';
      this.cccNnnMsg = this.processThisDate(myType, startDate, endDate);
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

  getcccUuu() {
    if (this.details) {
      const llllCccc = this.details.llllCccc || 0;
      const CcccAaa = this.details.ccccAaaAaaa || 0;
      return llllCccc - CcccAaa;
    }
  }

  getPpppCcc() {
    const used: number = this.getcccUuu() || 0;
    const llllCccc: number = this.details.llllCccc || 0;
    const percentage: number = (used / llllCccc) * 100;
    return percentage ? percentage : 0;
  }

  isCccLllWwwSssIiii() {
      if (this.details.llllCccc <= 0) { return false; }
      const component3 = this.getPpppCcc();
      if (component3 >= 100) {
        this.cccLllEee = true;
        return true;
      } else if ((component3 < 75) && (component3 >= 60)) {
        this.NnnCcclll = true;
        return true;
      }
  }

}
