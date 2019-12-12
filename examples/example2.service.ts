import { Injectable } from '@angular/core';
import { ServiceFive } from '@ngx-serviceFive/core';
import { HttpClient } from '@angular/common/http';
import { Model } from '../models';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Example2Service {
  lines = [];

  constructor(
    private serviceFive: ServiceFive,
    private http: HttpClient
  ) { }

  getBills(): Observable<Model[]> {
    return forkJoin([
      this.http.post<Model>('/api/foo', {}),
      this.http.post<Model>('/api/bar', {}),
      this.http.post<Model>('/api/fuz', {}),
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
    return (this.formatUsage(n, localeFormat) + ' ' + this.serviceFive.instant('usage.' + units[l]));
  }

  formatUsage = (usage: number, localeFormat?: boolean): string => {
    const u = usage.toFixed(2).split('.');
    let seperator = '.';
    if (localeFormat) {
      seperator = this.serviceFive.currentLang === 'fr' ? ',' : '.';
    }

    return u[1] === '00' ? u[0] : u.join(seperator);
  }

}
