import { Component } from '@angular/core';
import { ServiceThree } from './my-components';

import { Component71 } from './one.component';
import { Component72 } from './two.component';
import { ServiceEleven } from './eleven.service';
import { Service71 } from './one.service';

@Component({template: '', selector: 'xyz'})

export class Example7Componet {
  fooData = {
    ccc: null,
    cccEeeeChecked: false,
    aaaSssSelected: '',
    fo: 'all',
    ccccAaaAaaa: null
  };
  barData = {
    numSxFoo: null,
    typeFxFoo: null
  };
  targetPx: any;

  constructor(
    public serviceThree: ServiceThree,
    private component3Data: Service71,
    private navigation: ServiceEleven) {
  }

  // ENTRYPOINT
  async changePlPr() {
    const numPx1 = this.component3Data.getPx1();
    const pSFuz: any = await this.component3Data.getPpSFuz().toPromise();
    if (!pSFuz) {
      return;
    }
    const som = pSFuz && this.component3Data.checkIfMOS(pSFuz);

    if (som === 'x') {
      const fuz = this.component3Data.getFuz(pSFuz);
      const barStatus = this.component3Data.getBarStatus(fuz);

      if (barStatus === 'a') {
        const hasFooAa = this.component3Data.hasFooAaSubs(fuz);
        const typeFxFoo = hasFooAa ? 'multi' : 'single';
        this.targetPx = typeFxFoo === 'multi' ? 'X' : 'Y';
        this.setFooBarFuzData({numSxFoo: numPx1, fo: 'all', typeFxFoo});

      } else if (barStatus === 'b') {
        const mainS = this.component3Data.getMainSub(fuz);
        this.setFooBarFuzData({numSxFoo: mainS.numMainFoo, fo: 'm', typeFxFoo: 'm'});
        this.targetPx = 'X';

      } else if (barStatus === 'c') {
        const data: any = await this.getFooData(fuz, numPx1);
        this.setFooBarFuzData(data);
        this.targetPx = data.targetPx;
      }
    } else if (som === 'y') {
      const numSFooS = this.component3Data.getNumSFooS(pSFuz);
      this.targetPx = 'ChoosePlan';
      this.setFooBarFuzData({numSxFoo: numSFooS, fo: 'all', typeFxFoo: 's'});
    }
    const isGood = await this.getGoodness(this.barData.numSxFoo, this.barData.typeFxFoo);

    if (isGood === true) {
      this.fooData.cccEeeeChecked = true;
      this.saveFoo();
    }
  }

  async getGoodness(numSxFoo, typeFxFoo) {
    const eeeRrrSss: any = await this.component3Data.getEeeRrrSss(numSxFoo, typeFxFoo).toPromise();
    if (eeeRrrSss) {
      if (eeeRrrSss.good) {
        const isBbEeIi = await this.checkBbEeIi(eeeRrrSss);
        return isBbEeIi;
      } else if (eeeRrrSss.good === false) {
        this.serviceThree.open(Component71, {data: {
          stts: 'eligibility-error',
          errorCode: this.component3Data.formatEeeCccEee(eeeRrrSss.eligibilityCode)
        }});
      }
      return false;
    }
  }

  async checkBbEeIi(eeeRrrSss) {
    this.fooData.ccccAaaAaaa = eeeRrrSss.ccccAaaAaaa;

    const getFuz: any = await this.component3Data.getFuz().toPromise();
    const pFuz = getFuz && this.component3Data.getPpFuz(getFuz);

    if (pFuz && pFuz.length > 0) {
      const iiiCccc = pFuz[0].iiiCccc; // todays functionality is only picking one case ID even though there could be more
      const serviceThree: any = this.serviceThree.open(Component71, {data: { stts: 'b' }});

      serviceThree.pcc$.subscribe(async resp => {
        const cccCccC: any = await this.component3Data.cccCcc(iiiCccc).toPromise();
        if (cccCccC && cccCccC.rH && cccCccC.rH.status === 's') {
          const cccCccserviceThree: any = this.serviceThree.open(Component71, {data: { stts: 'c-a-s' }});
          cccCccserviceThree.saveFoo$.subscribe(cccCccResp => this.saveFoo());
        }
      });
      return false;
    }
    return true;
  }

  async saveFoo() {
    const saveBar = await this.component3Data.savePPCState(this.fooData).toPromise();
    saveBar && this.navigation.changeR({detail: this.targetPx});
  }

  async getFooData(activeFuz, numPx1) {
    const hasAM = this.component3Data.hasAM(activeFuz);
    const hasOivs =  this.component3Data.hasOivs(activeFuz);
    const promiseFunc = (resolve, reject) => {
      const etIspd =  this.component3Data.etIspd;  // DRY
      if (hasAM) {
        const mainS = this.component3Data.getMainSub(activeFuz);
        const hasAMserviceThree: any = this.serviceThree.open(Component71, {});
        const aaaSssSelected = this.component3Data.getAasp(activeFuz);
        // user chose to only make changes to individual line
        hasAMserviceThree.proceedWep$.subscribe(resp => {
          const payLep = etIspd('cp', numPx1, '');
          resolve (payLep);
        });
        // user chose to add individual line to shared plan and wants to add data
        hasAMserviceThree.proceedTad$.subscribe(resp => {
          const payLad = etIspd('csp', mainS.numMainFoo, aaaSssSelected);
          resolve (payLad);
        });
        // user chose to add individual line to shared plan and doesnt want to add data
        hasAMserviceThree.proceedTnad$.subscribe(resp => {
          const payLnad = etIspd('alo', mainS.numMainFoo, aaaSssSelected);
          resolve (payLnad);
        });

      } else if (hasOivs) {
          const oiiisubs = this.component3Data.getOiiis(activeFuz);
          const hasOivserviceThree: any = this.serviceThree.open(Component72,
            {data: { individualSubs: oiiisubs, numPx1: numPx1 }});
          // user chose to only make changes to individual line
          hasOivserviceThree.makeCtycp$.subscribe(resp => {
            const makeCtcppl = etIspd('cp', numPx1, '');
            resolve (makeCtcppl);
          });
          // user chose to create shared plan from individual lines
          hasOivserviceThree.createAspwyol.subscribe(resp => {
            const createAspwyolpl = etIspd('csp',
              resp.ccc, resp.aaaSssSelected);
            resolve (createAspwyolpl);
          });

      } else {
        const onlysiiip = etIspd('cp', numPx1, '');
        resolve (onlysiiip);
      }
    };

    return new Promise(promiseFunc);
  }

  private setFooBarFuzData(data) {
    const x = {
      a: data.x,
      b: data.y,
      c: data.z,
      d: data.a,
      e: data.b || ''
    };
    for (const x of Object.keys(x)) { this.barData[x] = x[x]; }
    for (const x of Object.keys(x)) { this.fooData[x] = x[x]; }
  }

}
