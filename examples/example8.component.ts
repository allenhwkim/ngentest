import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {Service81} from './one.service';
import {Service82} from './two.service';
import {ServiceThree, Component64, Component81} from './my-components';
import {ServiceFive} from '@ngx-serviceFive/core';
import {ServiceEleven} from '../framework/navigation.service';

@Component({
  selector: 'my-component',
  templateUrl: './my.html',
  styleUrls: ['./my.scss']
})
export class Example8Component implements OnInit {

  constructor(private service81: Service81, private serviceThree: ServiceThree,
              private serviceFive: ServiceFive, private service82: Service82,
              private navigation: ServiceEleven, private router: Router) {}

  async ngOnInit() {
    try {
      this.data = await this.service81.getSmade().toPromise();
      this.acovsu = this.data[0];
      this.acovde = this.data[1];
    } catch (e) {this.openFoo(e); }
  }

  resetVa(noReAd?) {
    this.sebi = null;
    this.sech = null;
    this.refoadfo = null;
    this.exisse = null;
    this.adchs = null;
    this.hichbl = false;
    this.sead = noReAd ? this.sead : null;
  }

  realfis() {
    this.resetVa();
    this.sese = null;
    this.wlpode = null;
    this.read = null;
  }

  async seplch(sese) {
    this.realfis();
    if (sese) {
      try {
        this.showlo = true;
        this.wlpode = await this.service81.getWipode(sese).toPromise();
        this.read = await this.service81.getReads(sese).toPromise();
        this.setAdtynbis();
        this.sese = sese;
      } catch (e) {this.openFoo(e); }
    }
  }

  async setAdtynbis() {
    try {
      this.adty = await this.service81.getAdTys().toPromise();
      this.acUsSu = await this.service81.loadBbbUuuu().toPromise();
      this.showlo = false;
    } catch (e) {
      this.adty = null;
      this.showlo = false;
      this.openFoo(e);
    }
  }

  adTyChd(sead) {
    this.resetVa();
    this.sead = sead;
    this.isTrsSed = sead.code === 'x';
    this.isIsNoFoshn = ['x', 'y'].includes(sead.code);
  }

  async biCyCh(sebi) {
    this.resetVa(true);
    this.sebi = sebi;
    this.hichbl = sebi === 'nb';
    !this.hichbl ? this.setCh() : null;
    try {
      this.adsDeCm = this.adsDeCm ? this.adsDeCm :
        await this.service81.getAdsDeCmDes().toPromise();
    } catch (error) {
      this.sebi = null;
      this.openFoo(error);
    }
  }

  async setCh() {
    this.service81.getAdsChs(this.sese, this.sebi).subscribe(
      resp => this.adchs = resp,
      err => {
        const buErStCo = (err.error || {}).fooCode;
        if (buErStCo === 560) {
          this.chErMsg = 'msg';
        } else {
          this.openFoo(err);
        }
      }
    );
  }

  async handleChSe(sech) {
    this.refoadfo = null;
    this.sech = sech;
  }

  async handleIsCh(seIs) {
    if (seIs.isSed || seIs.newInEnd || seIs.isOpOrCld === 'op') {
      this.refoadfo = true;
      this.exisse = seIs.isSed;
      this.showAuAdFl = this.exisse && this.exisse.auAd === 'noau';
      this.maIsNu = seIs.newInEnd;
    } else {
      this.refoadfo = false;
    }
  }

  showAdFo() {
    return (this.refoadfo || this.isTrsSed) &&
      this.adsDeCm && (this.sech || this.hichbl);
  }

  async foSu(frVls) {
    if (this.showAuAdFl) {
      try {
        await this.service82.setDaNCrIn(this.sead, this.exisse,
          frVls, this.sese).toPromise();
        this.opInRSuMo();
      } catch (e) {this.openFoo(e); }
    } else {
      this.submitCrMg(frVls);
    }
  }

  async submitCrMg(frVls) {
    // Creating payload only on Submit as user can keep on changing options so we don't have to keep on processing data on each change
    this.service82.setSeAdNBiDt(this.sese, this.sead, this.sebi);
    this.service82.setChDt(this.sech);
    this.service82.setIsDt(this.exisse, this.maIsNu, this.sead);
    this.service82.setFrDt(frVls);
    this.service82.submitCrMg().subscribe(
      resp => this.opInRSuMo(true, frVls),
      err => {
        const buErStCo = err.error && err.error.fooCode;
        if (buErStCo === 560) {
          const t = 'title';
          const c = 'sorry.';
          this.openFoo(err, t, c);
        } else {
          this.openFoo(err);
        }
      }
    );
  }

  opInRSuMo(showSbFl?, frVls?) {
    const serviceThree: any = this.serviceThree.open(Component81, {
      data: {
        adTy: this.sead.name,
        amount: showSbFl ? frVls.adAm : '0',
        adCd: ['N/A'],
        showSbFl: showSbFl
      }});
    serviceThree.dnCld.subscribe( () => {
      this.serviceThree.close();
      this.router.nvByUr(this.navigation.pvUr);
    });
  }

  openFoo(err?, t?, c?) {
    const grd = {
      x: this.serviceFive.instant(c || 'c'),
      y: this.serviceFive.instant(t || 't')
    };
    this.serviceThree.open(Component64, {x: grd});
  }

}
