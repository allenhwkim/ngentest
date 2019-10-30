import { Component, OnInit } from '@angular/core';
import { Inject, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { AuthGuardService } from './auth-guard.service';
import { CookieService } from './cookie.service';
import { AppLoadService } from './app-load.service';
import { CommonUtilsService } from './common-utils.service';

const foo = 1; // to make it sure component is picked for test, not this
const bar = 2; // to make it sure component is picked for test, not this

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.scss']
})
export class ExampleComponent implements OnInit {
  @ViewChild('menuEl') private menuEl: ElementRef;
  loggedIn: boolean = this.authGuardSvc.foo().bar.baz().isLoggedIn;
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
    // console.log('this is comments')
    this.language = cookie.get('language') || 'en'; // AssignmentExpression
    this.i18n = appInit.i18n.customElement; // AssignmentExpression

    this.router.route().foo().bar;  // for test
    // this.language.foo().bar;        // for test
    cookie.foo().bar.baz() || 'XX'; // for test
    cookie.foo().bar.baz() && 'YY'; // for test
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

