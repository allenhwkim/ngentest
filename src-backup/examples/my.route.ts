import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from './error/page-not-found.component';
import { ErrorPageComponent } from './error/error-page.component';
import { TranslationResolver } from './framework/translation.resolver';
import { BuildInfoResolver } from './framework/build-info.resolver';

const APP_ROUTES: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {
    path: 'dashboard',
    loadChildren: './dashboard/dashboard.module#DashboardModule',
    resolve: { i18n: TranslationResolver }
  },
  {
    path: 'about',
    loadChildren: './about/about.module#AboutModule',
    resolve: { i18n: TranslationResolver, buildInfo: BuildInfoResolver }
  },
  {
    path: 'error',
    component: ErrorPageComponent
  },
  {path: '**', component: PageNotFoundComponent}
];

export {APP_ROUTES};
