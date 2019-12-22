import { Component } from '@angular/core';

@Component({})
export class ExampleXComponent {

  doMore(param) {
    this.dtDts = this.dtSv.getDtDts4Sh(this.usDts);
    this.ttRmPc = (this.dtDts.rmDt / this.dtDts.ttDt) * 100;

    let dvDt;
    dvDt = this.dvDts[dvDtsNumber];
    const title = {
      en: dvDt ? dvDt.EN.pdTt : '',
      fr: dvDt ? dvDt.FR.pdTt : ''
    };

    const x = param.x.y.z;
    x.foo.bar();

    const thisVar = this.foo.bar.baz();
    thisVar.a.boc = '123';

    const sv3Cmp = this.serviceThree.open(Component64, { data: { result, reasonCode } });
    sv3Cmp.usAc.subscribe(ret => ret);

    this.ttAvUsAmBls = this.dates.reduce((acc, val) => acc + +val.ttUsThDt, 0) / this.dates.length;
  }

  setFooDddCcc() {
    this.fooCd = this.details.OooPppMmm.fooCdDetails;
    if (this.fooCd && this.fooCd.ccType) {
      this.fooImg = cardImg[this.fooCd.ccType.toLowerCase()];
    }
    this.fooBaz = lastDayOfMonth(this.bbbHhh.getLcDt(this.fooCd.fooBaz));
    this.fooBazDate = this.bbbHhh.formatDate(this.fooBaz, this.language);
    this.isFooDddCcc = this.bbbHhh.isFooDddCcc(this.fooBaz);
    this.isFooEeeCcc = !this.isFooDddCcc && this.bbbHhh.isFooEeeCcc(this.fooBaz);
    this.showFooXxx = this.isFooDddCcc || this.isFooEeeCcc;
    this.numDaysDone = this.isFooEeeCcc && differenceInCalendarDays(this.fooBaz, new Date());
  }

}