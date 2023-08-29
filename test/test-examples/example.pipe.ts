import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'nguiHighlight' })
export class NguiHighlightPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(text: string, search: string): string {
    let ret = text;
    if (search) {
      const re  = new RegExp(search, 'ig');
      ret = text.replace(re, match => `<span class="ngui-highlight">${match}</span>`);
    }

    return this.sanitizer.bypassSecurityTrustHtml(ret);
  }
}