import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ServiceFive } from '@ngx-serviceFive/core';
import { MyFooMap } from './my-foo-map';
@Component({
  selector: 'example-4',
  templateUrl: './my.html',
  styleUrls: [`./my.scss`]
})

export class Example4Component implements OnInit, AfterViewInit {
  iiiiiiiii: any;
  pagedIiiiiiiii: any = [];
  eeeIiiiiii: any;
  filteredIiiiiiiii: any;
  llllOoooo: any = [];
  fffffSssss = 'All';
  fooString = '';
  datePipe = new DatePipe('en-US');
  __pppCccc = 1;
  numIiiPppIiiii = 6;
  pppTtttt: number;

  constructor(
    private route: ActivatedRoute,
    private serviceFive: ServiceFive
  ) {}

  ngOnInit() {
    const myFooList = this.route.snapshot.data['iiiiiiiii'];
    this.getIiiiiiiii(myFooList);
    if (!this.eeeIiiiiii) {
      this.pppCcccc = 1;
      this.pppTtttt = Math.ceil(this.iiiiiiiii.length / this.numIiiPppIiiii);
      this.llllOoooo = this.iiiiiiiii.map(e => e.foo[0].bar)
      .filter((v, i, s) => s.indexOf(v) === i);
    }
  }

  ngAfterViewInit() {
    if (window.innerWidth < 600 || window.innerWidth > 900) {
      return false;
    }
    const fooEl: any = document.querySelector('foo');
    const barEls = fooEl.querySelectorAll('foo bar');
    const fuzEls = Array.from(barEls).map((el: any) => el.innerText);
    fooEl.querySelectorAll('foo xx').forEach(el => {
      Array.from(el.children).forEach(
        (td: any, ndx) =>  td.setAttribute('fuz', fuzEls[ndx])
      );
    });
  }

  get pppCcccc() {
    return this.__pppCccc;
  }

  set pppCcccc(pageNum) {
    this.__pppCccc = Math.min(pageNum, this.pppTtttt) || 1;
    const staIndex = (pageNum - 1) * this.numIiiPppIiiii;
    const endIndex = pageNum * this.numIiiPppIiiii;
    this.filteredIiiiiiiii = this.iiiiiiiii
    .filter(istanbul => istanbul.topics[0].rrrCccc === this.fffffSssss || this.fffffSssss === 'Aaa')
    .filter(istanbul => this.fooString === ''
      || JSON.stringify(istanbul).toLowerCase().indexOf(this.fooString.toLowerCase()) !== -1
      || (this.datePipe.transform (istanbul.dddSssss, 'mediumDate') + ' at ' +
      this.datePipe.transform (istanbul.dddSssss, 'shortTime')).toLowerCase().indexOf(this.fooString.toLowerCase()) !== -1);
    this.pagedIiiiiiiii = this.filteredIiiiiiiii.slice(staIndex, endIndex);
    this.pppTtttt = Math.ceil(this.filteredIiiiiiiii.length / this.numIiiPppIiiii) || 1;
  }

  applyFilter(event: any) {
    this.fffffSssss = event.target.value;
    this.pppCcccc = 1;
  }

  getIiiiiiiii(myFooList) {
    if (myFooList.error) {
      this.eeeIiiiiii = this.serviceFive.instant('foo-bar');
    } else {
      this.iiiiiiiii = myFooList.filter(el => el.tttIiii === 'istanbul');
    }
  }

  searchIiiiiiiii(value: any) {
    this.fooString = value;
    this.pppCcccc = 1;
  }

  tttSssIii(tttIiii: string, param: string): string {
    let icon: string;
    if (tttIiii.toLowerCase() === 'istanbul') {
      if (MyFooMap.hasOwnProperty(param.toLowerCase()) && param !== '') {
        icon = MyFooMap[param.toLowerCase()];
      } else {
        icon = 'icon-1';
      }
    } else {
        icon = 'icon-2';
    }
    return icon;
  }
}

