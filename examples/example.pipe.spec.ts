import { async } from '@angular/core/testing';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { NguiHighlightPipe } from './example.pipe';
import { DomSanitizer } from '@angular/platform-browser';

describe('NguiHighlightPipe', () => {
  let pipe;

  beforeEach(() => {
    pipe = new NguiHighlightPipe({});
  });

  it('should run #transform()', async () => {
    pipe.sanitizer = pipe.sanitizer || {};
    pipe.sanitizer.bypassSecurityTrustHtml = jest.fn();
    pipe.transform('text', {});
    // expect(pipe.sanitizer.bypassSecurityTrustHtml).toHaveBeenCalled();
  });

});
