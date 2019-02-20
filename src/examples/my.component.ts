import { Component, OnInit } from '@angular/core';
import { Inject, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { AuthGuardService } from './common/app-common.module';
import { CookieService } from './common/services/cookie.service';
import { AppLoadService } from './framework/app-load.service';
import { CommonUtilsService } from './common/services/common-utils.service';

const foo = 1; // to make it sure component is picked for test, not this
const bar = 2; // to make it sure component is picked for test, not this

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('menuEl') private menuEl: ElementRef;
  loggedIn: boolean = this.authGuardSvc.isLoggedIn;
  i18n: any;
  language: any;

  constructor(
    private authGuardSvc: AuthGuardService,
    private cookie: CookieService,
    private appInit: AppLoadService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private commonUtilsSvc: CommonUtilsService
  ) {
    this.language = cookie.get('language') || 'en';
    this.i18n = appInit.i18n.customElement;
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        setTimeout(_ => {
          const menuId = event.urlAfterRedirects.substr(1);
          this.menuEl.nativeElement.highlightMenu(menuId);
        }, 500);
      }
    });
  }

  logout() {
    this.authGuardSvc.logoff();
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
    this.router.navigate([routeName]);
  }

  reportIssue(event) {
    this.commonUtilsSvc.reportIssue(navigator.userAgent);
  }
}

