import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appTruncate'
})

// ? May want to add this to oneview-components
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 20): any {
    return value && value.length > limit ? `${value.substring(0, limit)} ...` : value;
  }
}