import { Component, OnInit } from '@angular/core';
import { Inject, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { AuthGuardService } from './common/app-common.module';
import { CookieService } from './common/services/cookie.service';
import { AppLoadService } from './framework/app-load.service';
import { AgentHeaderDataService } from './common/services/agent-header-data.service';
import { CommonUtilsService } from './common/services/common-utils.service';
import { DeeplinkService } from './common/services/deeplink.service';

import 'rci-components/custom-elements';

const foo = '1';
const bar = '2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('agentHeader') private agentHeader: ElementRef;
  loggedIn: boolean = this.authGuardSvc.isLoggedIn;
  nextLanguage: string;
  i18n: any;
  agentInfo: any;
  subMenuServices: any;
  customerInfo: any;
  language: any;
  province: any;

  get heartBeatUrl() {
    const sourceUrl = this.appInit.agentInfo.sourceURL;
    const jSessionId = this.appInit.agentInfo.jsessionId;
    return `${sourceUrl}shop/cfa/o/logout-keep-alive;jsessionid=${jSessionId}`;
  }

  constructor(
    private authGuardSvc: AuthGuardService,
    private cookie: CookieService,
    private appInit: AppLoadService,
    private agentHeaderDataSvc: AgentHeaderDataService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private commonUtilsSvc: CommonUtilsService,
    private deeplinkSvc: DeeplinkService
  ) {
    this.language = cookie.get('language') || 'en';
    this.nextLanguage = this.language === 'fr' ? 'en' : 'fr';
    this.province = cookie.get('province') || 'ON'; // TODO: Province cookie logic
    this.i18n = appInit.i18n.customElement;
    this.agentInfo = appInit.agentInfo['cfaInfo'];
    this.subMenuServices = agentHeaderDataSvc.subMenuServices;
    this.customerInfo = [agentHeaderDataSvc.customerDetails];
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        setTimeout(_ => {
          const menuId = event.urlAfterRedirects.substr(1);
          if (menuId.match(/\/(\d*)/)) {
            this.agentHeader.nativeElement.highlightMenu('services');
          } else if (menuId) {
            this.agentHeader.nativeElement.highlightMenu(menuId);
          }
        }, 500);
      }
    });
  }

  logout() {
    // this.authGuardSvc.logoff();
    this.goToSSP();
  }

  // istanbul ignore next
  changeLanguage(event) {
    const currentLang = this.cookie.get('language');
    document.cookie = currentLang === 'fr' ? 'language=en;' : 'language=fr;';
    window.location.reload();
  }

  // istanbul ignore next
  onDeactivate() {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    window.scrollTo(0, 0); // go to top when route changes
  }

  changeRoute(event) {
    const routeName = event.detail.replace(/-([0-9]+)$/, (_, num) => '/' + num);

    if (routeName === 'bill') {
      window.location.href = '/web/totes/#/viewbill';
    } else if (routeName.match(/^wireless/)) {
      window.location.href = '/web/totes/#/' + routeName;
    } else if (routeName.match(/^internet/)) {
      window.location.href = '/web/totes/#/' + routeName.replace('internet', 'internetdash');
    } else if (routeName.match(/^tv/)) {
      window.location.href = '/web/totes/#/' + routeName.replace('tv', 'tvdashboard');
    } else if (routeName === 'profile') {
      window.location.href = '/web/totes/#/profile';
    } else if (routeName === 'interactions') {
      window.location.href = '/web/totes/#/interaction';
    } else if (routeName === 'actions') {
      window.location.href = '/web/totes/#/actionsOffers';
    } else {
      this.router.navigate([routeName]);
    }
  }

  goToSSP(event?) {
    const phoneNumber = '';
    const accountNumber = this.appInit.customerInfo.accountNumber;

    const postData = {
      ctn: phoneNumber,
      accountNumber: accountNumber,
      lang: this.language,
      prov: this.province,
      targetFlow: 'sspdashboard',
      sourceURL: window.location.href
    };

    return this.deeplinkSvc.backToSSP(postData);
  }

  deeplink(e) {
    if (e.detail === 'oasys') {
      this.deeplinkSvc.deepLinkOasys();
    } else if (e.detail === 'salesAssist') {
      const payload = {
        transactiontype: 'deeplink',
        targetapp:  'SalesAssist'
      };
      this.deeplinkSvc.deepLinkToSSPSalesAssist(payload);
    }
  }

  reportIssue(event) {
    this.commonUtilsSvc.reportIssue(navigator.userAgent);
  }
}

