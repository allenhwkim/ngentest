import { async } from '@angular/core/testing';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { TruncatePipe } from './example2.pipe';

describe('TruncatePipe', () => {
  let pipe;

  beforeEach(() => {
    pipe = new TruncatePipe();
  });

  it('should run #transform()', async () => {

    pipe.transform({
      length: {},
      substring: function() {}
    });

  });

});
