import { Component, OnInit } from '@angular/core';
import { Inject, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import * as myAlias from 'alias-npm-module';

import { AuthGuardService } from './auth-guard.service';
import { CookieService } from './cookie.service';
import { AppLoadService } from './app-load.service';

@Component({
  selector: 'app-root',
  template: '<div>Example Component</div>',
  styles: ['']
})
export class ExampleComponent implements OnInit {
  @ViewChild('menuEl') private menuEl: ElementRef;
  loggedIn: boolean = this.authGuardSvc.foo().bar.baz().isLoggedIn;
  language: string;
  foo;

  constructor(
    private authGuardSvc: AuthGuardService,
    private cookie: CookieService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
  ) {
    // console.log('this is comments')
    this.language = cookie.get('language') || 'en'; // AssignmentExpression

    this.router.route().foo().bar;  // for test
    // this.language.foo().bar;        // for test
    cookie.foo().bar.baz() || 'XX'; // for test
    cookie.foo().bar.baz() && 'YY'; // for test
  }

  ngOnInit() {
    const thresholdAmount = Number(this.adjustmentsDetailsCms.location.threshold);
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

}

