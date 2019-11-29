import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import {Component} from '@angular/core';
import {PastUsageService} from './example2.service';
import {TranslateService} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
class MockTranslateService {
  instant = jest.fn();
  currentLang = {};
  translate = jest.fn();
}

@Injectable()
class MockHttpClient {
  post = jest.fn();
}
describe('PastUsageService', () => {
  let service;

  beforeEach(() => {
    service = new PastUsageService({
        instant: jest.fn(),
        currentLang: '[object Object]'
      }, {});
  });

  it('should run #getBills()', async () => {
    service.http = service.http || {};
    service.http.post = jest.fn().mockReturnValue(observableOf('post'));;
    service.getBills();
    expect(service.http.post).toHaveBeenCalled();
  });

});
