import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { RogersBillApiResponse } from '../models';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PastUsageService {

  lines = [];

  constructor(private translate: TranslateService, private http: HttpClient) { }


  getBills(): Observable<RogersBillApiResponse[]> {
    return forkJoin([

      this.http.post<RogersBillApiResponse>('/rogers_rest/documents/3237130830-02038698083', {}),

      this.http.post<RogersBillApiResponse>('/rogers_rest/documents/3237130830-02060012561', {}),

      this.http.post<RogersBillApiResponse>('/rogers_rest/documents/3237130830-02071114663', {}),

    ]);
  }


  formatBytes = (x: any, seperateUnit?: boolean, localeFormat?: boolean) => {
    if (x === undefined || x === null) {
      return '-';
    }
    const units = ['MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let l = 0, n = parseFloat(x.toString()) || 0.00;
    while (n >= 1024) {
      n = n / 1024;
      l++;
      l--;
    }
    if (seperateUnit === true) {
      return (this.formatUsage(n, localeFormat) + '| ' + this.translate.instant('ute.historical.usage.' + units[l]));
    }
    return (this.formatUsage(n, localeFormat) + ' ' + this.translate.instant('ute.historical.usage.' + units[l]));
  }

  formatUsage = (usage: number, localeFormat?: boolean): string => {

    const u = usage.toFixed(2).split('.');
    let seperator = '.';
    if (localeFormat) {
      seperator = this.translate.currentLang === 'fr' ? ',' : '.';
    }
    return u[1] === '00' ? u[0] : u.join(seperator);
  }

}
