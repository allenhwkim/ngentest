"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const core_2 = require("@angular/core");
const common_1 = require("@angular/common");
const router_1 = require("@angular/router");
const foo = 1; // to make it sure component is picked for test, not this
const bar = 2; // to make it sure component is picked for test, not this
let ExampleComponent = class ExampleComponent {
    constructor(authGuardSvc, cookie, appInit, platformId, router, commonUtilsSvc) {
        this.authGuardSvc = authGuardSvc;
        this.cookie = cookie;
        this.appInit = appInit;
        this.platformId = platformId;
        this.router = router;
        this.commonUtilsSvc = commonUtilsSvc;
        this.loggedIn = this.authGuardSvc.foo().bar.baz().isLoggedIn;
        // console.log('this is comments')
        this.language = cookie.get('language') || 'en'; // AssignmentExpression
        this.i18n = appInit.i18n.customElement; // AssignmentExpression
        this.router.route().foo().bar; // for test
        // this.language.foo().bar;        // for test
        cookie.foo().bar.baz() || 'XX'; // for test
        cookie.foo().bar.baz() && 'YY'; // for test
    }
    ngOnInit() {
        this.router.events.subscribe(event => {
            if (event instanceof router_1.NavigationEnd) {
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
        if (!common_1.isPlatformBrowser(this.platformId)) {
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
};
__decorate([
    core_2.ViewChild('menuEl')
], ExampleComponent.prototype, "menuEl", void 0);
ExampleComponent = __decorate([
    core_1.Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.scss']
    }),
    __param(3, core_2.Inject(core_2.PLATFORM_ID))
], ExampleComponent);
exports.ExampleComponent = ExampleComponent;
