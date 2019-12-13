import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Example2Service } from './example2.service';
import { ServiceFive } from '@ngx-serviceFive/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
class MockHttpClient {
  post() {};
}

describe('Example2Service', () => {
  let service;

  beforeEach(() => {
    service = new Example2Service({
        instant: function() {},
        currentLang: {}
      }, {});
  });

  it('should run #getBills()', async () => {
    service.http = service.http || {};
    service.http.post = jest.fn().mockReturnValue(observableOf('post'));
    service.getBills();
    // expect(service.http.post).toHaveBeenCalled();
  });

});
