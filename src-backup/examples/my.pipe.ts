import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'nguiHighlight' })
export class NguiHighlightPipe implements PipeTransform {
  transform(text: string, search: string): string {
    let ret = text;
    if (search) {
      const re  = new RegExp(search, 'ig');
      ret = text.replace(re, match => `<span class="ngui-highlight">${match}</span>`);
    }

    return ret;
  }
}