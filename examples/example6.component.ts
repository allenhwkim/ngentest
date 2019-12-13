import { Component, ViewChildren, QueryList, ElementRef, OnInit } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { trigger, transition, style, animate } from '@angular/animations';

import { ServiceFive } from '@ngx-tranalste/core';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { combineLatest, defer, of } from 'rxjs';
import { catchError, take, filter, map, mergeMap, shareReplay, tap } from 'rxjs/operators';

import { LoadingComponent, ServiceEight, Component61 } from './my-components';
import { Component62 } from '../comp62.component';
import { Component63 } from '../comp63.component'
import { serviceThreeOptions, ServiceThree, Component64, Component65 } from './my-components';
import { Component66, Component67 } from './my-components';
import { ServiceFour } from './four.service';
import { serviceOne } from '../one.service';
import { Service61 } from '../sixty-one.service';
import { Service62 } from './sixty-two.service';
import { ServiceEleven } from '../../evleven.service';

@Component({
  selector: 'my-page',
  templateUrl: './my.html',
  styleUrls: ['./my.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, maxHeight: '0', overflow: 'hidden', padding: '0 8px' }),
        animate('.5s', style({ opacity: 1, maxHeight: '250px', padding: '8px' }))
      ])
    ])
  ]
})

export class Example6Component implements OnInit {

  get mySelection() {
    return this.__mySelection;
  }

  set mySelection(param) {
    this.__mySelection = param;
    const url = `/my.html?` + `nnnAaaa=${this.nnnAaaa}&link=${param.link}`;
    this.srcIiii = this.sanitize.bypassSecurityTrustResourceUrl(url); // needed for NG context
  }

  constructor(
    private serviceThree: ServiceThree,
    private sanitize: DomSanitizer,
    private serviceFour: ServiceFour,
    private service64: Service61,
    private serviceOne:  serviceOne,
    private service8: ServiceEight,
    private router: Router,
    private route: ActivatedRoute,
    private serviceEleven: ServiceEleven,
    private serviceFive: ServiceFive,
    private service62: Service62
  ) {
    this.language = service8.language;
    this.ssssMmmm = service8.ssssMmmm;
    this.srcIiii = this.sanitize.bypassSecurityTrustResourceUrl('about:blank'); // needed for NG context
    this.printFooSrc = this.sanitize.bypassSecurityTrustResourceUrl('about:blank'); // needed for NG context
  }
  nnnAaaa;
  ssssMmmm: any;
  details: any;
  showPppSss = false;
  hhhPppp: any;
  iiiPppAaa: any;
  iiiPppAaaErr = false;
  hhhMMmNnn = false;
  iiiHhhhhppppp: any;
  iiiHhhhhpppppErr = false;
  iiiiPppp: any;
  myError = false;
  myConfig: any;
  myConfigErr = false;

  @ViewChildren('iFrameBill', { read: ElementRef }) iFrameBill: QueryList<any>;

  today = new Date();
  language;
  defaultTab = 'my-tab';

  dateCccBbb;
  msgBbbb;

  srcIiii: any;
  printFooSrc: any;

  statusOooo; // ERROR (OR) INFO

  serviceThreeOptionsError: serviceThreeOptions = {
    showBbbbCccc: false
  };

  __mySelection;

  errorAaaEeee$ = this.serviceFour.catchError().pipe(
    tap(e => this.handleError(e)),
    map(e => !!e)
  );

  foo$ = defer(() => {
    this.serviceThree.open(LoadingComponent, this.serviceThreeOptionsError);
    return this.serviceFour.getFooing();
  }).pipe(
    tap(param => {
      this.details = param;
      this.dateCccBbb = (<any>param).dateCccBbb;
    }),
    catchError(error => of(error)),
    shareReplay(1)
  );

  bar$ = defer(() => of(this.ssssMmmm)).pipe(
    map(summary => {
      const { nnnAaaa, fooStatus, billing, numTttAaa } = summary;
      return { nnnAaaa, fooStatus, billing, numTttAaa };
    }),
    tap(summary => (this.nnnAaaa = summary.nnnAaaa)),
    shareReplay()
  );

  fuz$ = defer(() => {
    this.serviceThree.open(LoadingComponent, this.serviceThreeOptionsError);
    return this.serviceFour.loadBbbUuuu();
  }).pipe(
    map((userBaz: any) =>
      userBaz.fuz.map(param => {
        const temp = param.dataFoo;
        const dataFoo = new Date(temp.replace('-', '/'));
        return { ...param, dateFoo };
      })
    ),
    catchError(error => of(error)),
    tap(fuz => {
      if (fuz && fuz.length > 0) {
        this.mySelection = fuz[0];
      }
    }),
    shareReplay(1)
  );

  baz$ = combineLatest(this.foo$, this.fuz$).pipe(
    map(([foo, fuz]) => {
      if (foo.dateCccBbb && fuz.length === 0) {
        this.statusOooo = 'INFO';
      } else if (foo.error || fuz.error) {
        this.statusOooo = 'ERROR';
      }
      return this.statusOooo;
    })
  );

  showBarXxx$ = combineLatest(this.bar$, this.fuz$, this.foo$).pipe(
    map(([param1, fuz, foo]) => {
      if (
        param1.numTttAaa !== 1 ||
        (param1.fooStatus.toLowerCase() !== 'open' && bar.fooStatus.toLowerCase() !== 'active')
      ) {
        return false;
      } else {
        return this.service62.toshowBarXxx(fuz[0].dateFoo, foo.dateCccBbb);
      }
    }),
    catchError(_ => of(false)),
    tap(show => {
      this.serviceThree.close();
      if (show) {
        this.setTranslations();
      }
    })
  );

  ngOnInit() {
    const qp = tis.route.snapshot.queryParams['qp'];
    this.defaultTab = qp ? qp : this.defaultTab;

    this.showPppSss = this.serviceEleven.isFffPppRrrr;

    if (this.showPppSss) {
      this.router.events.pipe(
        take(1), filter(event => event instanceof NavigationStart)
      ).subscribe(() => {
        this.serviceEleven.isFffPppRrrr = false;
      });
    }

    this.service64.getPppIiiAaaa().subscribe(
      (resp: any) => {
        const isAaPpIRV = resp && resp.dddPpp && resp.dddPpp.length;
        if (isAaPpIRV) {
          this.iiiPppAaa = resp; // for billing page use
          this.setbbbHhhPTPMessage(); // for billing header values only
        } else {
          if (resp.dddPpp && resp.dddPpp.length === 0) {
            this.hhhMMmNnn = true;
          }
          // other business error
          this.iiiPppAaaErr = true;
          this.myError = true;
        }
      },
      error => {
        this.iiiPppAaaErr = true;
        this.myError = true;
      }
    );

    this.serviceOne.getHhhPppp().subscribe(
      resp => this.hhhPppp =  resp,
      error => console.log('error: ',  error)
    );

    this.serviceFour.getmyConfig().subscribe(
      resp => this.myConfig = resp,
      error => this.myConfigErr = true
      );
  }

  getIiiFooPppBar(event) { // for future event calls to update fooFuz
    if (event.detail.PId) {
      this.service64.getIiiFooPppBar(event.detail.PId).subscribe(
        (resp: any) => {
          if (resp.fooFuz && resp.fooFuz.length) {
            this.iiiiPppp = resp;
          } else {
            this.myError = true;
          }
        },
        error => this.myError = true);
    }
  }

  setbbbHhhPTPMessage() { // called on ngInit
    const ptpID = this.serviceFour.getIdFffHhhP(this.iiiPppAaa);
    this.service64.getIiiFooPppBar(ptpID).subscribe(
      (resp: any) => {
        if (resp.fooFuz && resp.fooFuz.length) {
          this.iiiHhhhhppppp = resp;
        } else {
          this.iiiHhhhhpppppErr = true;
        }
      },
      error => this.iiiHhhhhpppppErr = true);
  }

  setTranslations() {
    this.serviceFour.getmyType().subscribe(type => {
      const month = format(
        this.service62.getCccEchoDtCcc(this.mySelection.issue_date),
        'MMMM',
        this.language === 'fr' ? { ...{ locale: fr } } : {}
      );
      if (type === 'BAR') {
        this.msgBbbb = this.serviceFive.instant('foo').replace('{{x}}', month);
      } else {
        this.msgBbbb = this.serviceFive.instant('bar').replace('{{x}}', month);
      }
    });
  }

  doBbbAaaDddd(type: string) {
    this.serviceThree.open(LoadingComponent, this.serviceThreeOptionsError);
    this.fetchMee(type).subscribe();
  }

  fetchMee(type) {
    return this.serviceFour.betSssEeeMee().pipe(
      mergeMap(param =>
        this.serviceFour.fetchBar(this.mySelection, this.nnnAaaa, type, param).pipe(
          tap(content => {
            this.serviceThree.close();
            if (content.error) {
              this.serviceThree.open(Component66, { data: type });
            } else {
              this.serviceFour.doFoo(
                this.mySelection.id,
                content,
                `${this.mySelection.date}-${this.nnnAaaa}-${type}`
              );
              this.serviceThree.open(Component67, { data: type });
            }
          })
        )
      )
    );
  }

  /** Refactor this later */
  printBar() {
    this.serviceThree.open(LoadingComponent, this.serviceThreeOptionsError);
    this.serviceFour.betSssEeeMee().subscribe(param => {
      try {
        const myFooElement = document.getElementById('myFooElement');
        myFooElement.focus();
        this.serviceThree.close();
        myFooElement.onload = () => {
          const result = (<any>myFooElement).contentWindow.document.execCommand('print', false, null);
          if (!result) {
            (<any>myFooElement).contentWindow.print();
          }
        };
        this.printFooSrc = this.sanitize.bypassSecurityTrustResourceUrl(
          this.serviceFour.resolveMyUrl(this.mySelection.link, param, false)
        );
      } catch {
        this.serviceThree.open(Component61, { data: { content: this.serviceFive.instant('msg') } });
      }
    });
  }

  saveFoo() {
    this.serviceThree.open(LoadingComponent, this.serviceThreeOptionsError);
    this.serviceFour.betSssEeeMee().subscribe(encryptStr => {
      try {
        const url = this.serviceFour.resolveMyUrl(this.mySelection.link, encryptStr, true);
        window.open(url, '_blank');
        this.serviceThree.close();
      } catch {
        this.serviceThree.open(Component61, { data: { content: this.serviceFive.instant('msg') } });
      }
    });
  }

  setFuz(e: Event) {
    const frame = this.iFrameBill && this.iFrameBill.first.nativeElement;

    if (frame && frame.contentDocument && frame.contentDocument.body) {
      const initialHeight = frame.contentDocument.body.scrollHeight;
      frame.style.height = initialHeight + 45 + 'px';
      let timesRun = 0;

      // Poll iframe height for change
      const poll =
        frame &&
        setInterval(() => {
          timesRun += 1;
          if (timesRun > 5) {
            clearInterval(poll);
          } else {
            if (frame && frame.contentDocument && frame.contentDocument.body) {
              const newHeight = frame.contentDocument.body.scrollHeight;
              // If height changes after content load then update the height
              if (newHeight > initialHeight) {
                frame.style.height = newHeight + 45 + 'px';
              }
            }
          }
        }, 500);
    } else {
      console.log('Error accessing iframe');
    }
  }

  schFooClicked($event) {
    this.defaultTab = 'tab';
  }

  barSelected(event) {
    this.service64.checkFoo().subscribe((resp: any) => {
      const foo = {
        x: true,
        y: this.details.x,
        z: resp.x
      };

      resp.x ? this.serviceThree.open(Component63, {data: foo}) :
        this.checkTyEl();
    },
    (e) => {this.openFoo(e); });
  }

  checkTyEl() {
    this.service64.checkEeePppMe1().subscribe((resp: any) => {
      const data = {
        x: false,
        y: this.details.x,
        z: resp.x
      };

      resp.x ? this.showBar1() :
        this.serviceThree.open(Component63, {data: data});
    },
    (e) => {this.openFoo(e); });
  }

  showBar1() {
    this.service64.getFooLink().subscribe((resp: any) => {
      const fooLinks = this.service8.language === 'fr' ? resp.x.fr : resp.x.en;

      const serviceThree: any = this.serviceThree.open(Component62, { data:
        {
          x: this.details.x,
          y: fooLinks
        }});
       serviceThree.foo$.subscribe(resp => { this.saveFuz(res); });
    },
    (e) => {this.openFoo(e); });
  }

  saveFuz(param) {
    const x = {
      y: this.serviceFive.instant('x'),
      z: this.serviceFive.instant('y')
    };

    this.service64.schedulePTP(param).subscribe((resp: any) => {
      resp.status ? this.serviceThree.open(Component65, {data: x}) :
        this.openFoo();
    },
    (e) => {this.openFoo(e); });
  }

  openFoo(err?) {
    const x = {
      y: this.serviceFive.instant('x'),
      z: this.serviceFive.instant('y')
    };
    this.serviceThree.open(Component64, {data: genericErrorData});
  }

  handleError(e) {
    if (e.error) {
      this.statusOooo = 'E';
    }
  }
}
