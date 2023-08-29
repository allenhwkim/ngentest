import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ServivceSix } from '@rogers/oneview-components';

import { ServiceSeven } from '@rogers/oneview-components';
import { ServiceEight } from '@rogers/oneview-components';
import { ServiceThree } from '@rogers/oneview-components';

import { ServiceNine } from './nine.service';
import { ServiceTen } from './ten.service';
import { ServiceEleven } from '../eleven.service';
import { ServiceTwelve } from '../twelve.service';
import { ServiceFourteen } from './fourteen.service';
import { ComponentOne } from './one.component';
import { ComponentTwo } from './two.component';
import { ServiceThirteen } from './thirteen.service';
import { ServiceFifteen } from '../fifteen.service';
import { ComponentThree } from './three.component';

@Component({
  selector: 'example-5',
  templateUrl: './my.html',
  styleUrls: [`./my.scss`]
})
export class Example5Component implements OnInit {
  nnnAaaa: any;
  ssssMmmm: any;
  sssTttSsss: any;
  sssIiiiiii = { ofni: {}, iiiCccc: 5 };
  pppUuuu: any;
  fooBarSummary: any = { dddSssFoo: [{ pppDddFooPpp: {} }] };
  @ViewChild('fffCccDddd', {read: ElementRef}) fffCccDddd: ElementRef;
  @ViewChild('myFooList', {read: ElementRef}) myFooList: ElementRef;
  @ViewChild('fooList1', {read: ElementRef}) fooList1: ElementRef;
  @ViewChild('mmmSssAaa', {read: ElementRef}) mmmSssAaa: ElementRef;
  @ViewChild(ComponentThree) component3: ComponentThree;

  constructor(
    private service8: ServiceEight,
    private serviceSixteen: ServiceSeven,
    private service6: ServivceSix,
    private service12: ServiceTwelve,
    private el: ElementRef,
    private service9: ServiceNine,
    private service10: ServiceTen,
    private service14: ServiceFourteen,
    private ServiceThree: ServiceThree,
    public serviceEleven: ServiceEleven,
    private service15: ServiceFifteen,
    private service13: ServiceThirteen
  ) {
    this.nnnAaaa = service8.nnnAaaa;  // Patch fix to send account number in Preapproval & Subscription/summary request
    this.ssssMmmm = service8.ssssMmmm;
    this.sssTttSsss = service14.getServiceFourteen();
  }

  HasEeeSss: boolean;
  isOooCcc: boolean;
  AaaPppFoo: boolean;
  EeeDddSssss: any;
  iiiiiiiiiDetails: any;
  ErrDdddd: any;
  sssDddd: any;
  FooDdddPppp: any;
  FooDdddPpppErr: boolean;
  fooBarErr: any;
  tttAaaaaa: any;
  eeeIiiiiii: boolean;
  details: any;
  vh: any;
  sassFoo: any = {i: true, t: true, h: true, s: true, i: true};

  get isHhhAaa(): boolean {
    return this.service8.bazInfo['consumer'] &&
      this.service8.bazInfo.authorizationLevel &&
      this.service8.bazInfo.authorozationLevel.toUpperCase() === 'ACCOUNT_HOLDER';
  }

  ngOnInit() {
    this.isOooCcc = this.ssssMmmm.lob === 'C';
    this.service9.getdetails()
      .subscribe (
        resp => this.details = resp
      );
    this.service9.getPostDatedPPC()
      .subscribe(
        resp =>  this.FooDdddPppp = resp,
        error => this.FooDdddPpppErr = true
      );
    this.service12.getSssIiiiD.subscribe(resp => this.sssIiiiiii = resp);
    // show shareverything section first before we get subscription summary
    this.EeeDddSssss =
    this.serviceSixteen.getEeeDddSsss(this.ssssMmmm, this.fooBarSummary);
    this.service9.getIiiiiiiii()
      .subscribe(
        resp => this.iiiiiiiiiDetails = resp,
        error => this.eeeIiiiiii = true
      );
    this.service9.getFooBar1Summary(this.nnnAaaa, 'foo')
      .subscribe(resp => {
        this.fooBarSummary = resp;
        this.EeeDddSssss = this.serviceSixteen.getEeeDddSsss(this.ssssMmmm, resp);
        this.HasEeeSss = !!this.EeeDddSssss.nnnPpp;
      });

    this.sassFoo = this.service9.getSssAaaLll();

    this.service15.getTttAaa().subscribe(
      tttAaaaaa => {
        this.tttAaaaaa = tttAaaaaa;
        this.service15.getSD(this.tttAaaaaa.ecid).subscribe(
          resp => this.sssDddd = resp,
          error => this.ErrDdddd = true
        );
      },
      error => this.fooBarErr = this.service9.handleEeeDT(error)
    );

  }

  updateHanoi(event) {
    setTimeout(() => {
      this.vh = this.fffCccDddd.nativeElement.offsetHeight;
      this.myFooList.nativeElement.style.height = this.vh + 'px';
      this.fooList1.nativeElement.style.height = this.vh + 'px';
    }, 500);
  }

  openSsMmD(serviceThreeType) {
    this.ServiceThree.open(ComponentOne, {data: serviceThreeType});
  }

  async startFfPp(event) {
    const fooOneCode = this.service8.bazInfo.fooOneCode;
    const allowedAcDc = this.service6.isFooDone('FooCode', 'update');

    if (allowedAcDc && !fooOneCode) {
      const serviceThree = this.ServiceThree.open(ComponentTwo, {
        data: {state: 'sss'}
      });
      serviceThree.fooOneCodeChange$.subscribe(async newFooCode => {
        const isFooCodeUpdated = await this.service13.checkFfCuI(newFooCode);
        if (isFooCodeUpdated) {
          this.component3.changePlPr();
        }
      }
      );
    } else {
      this.component3.changePlPr();
    }
  }

  async handleFlBu(event) {
    const fooOneCode = this.service8.bazInfo.fooOneCode;
    const selectedccc = event.detail.ccc;
    const nnnAaaa = this.service8.ssssMmmm.nnnAaaa;
    const allowedAcDc = this.service6.isFooDone('FooCode', 'update');

    if (allowedAcDc && !fooOneCode) {
      const serviceThree = this.ServiceThree.open(ComponentTwo, {
        data: {state: 'success'}
      });
      serviceThree.fooOneCodeChange$.subscribe(newFooCode =>
        this.service10.handleFooCodeChange(newFooCode, nnnAaaa, selectedccc) //
      );
    } else {
      const isGood = await this.service10.checkTyEl(nnnAaaa, selectedccc);
      isGood && this.service10.upgradeDwHa(nnnAaaa, selectedccc);
    }
  }

  goIgTTo(event) {
    this.el.nativeElement.dispatchEvent(new CustomEvent('n-to', {
      detail: 'getTTig',
      bubbles: true
    }));
  }
}
