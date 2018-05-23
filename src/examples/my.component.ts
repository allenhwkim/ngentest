import {
  Component, ContentChild, ElementRef, EventEmitter,
  Inject, Input, OnDestroy, OnInit, Output,
  PLATFORM_ID, Renderer2, TemplateRef, ViewChild
 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as _ from 'lodash';

@Component({
  selector: 'ngui-inview',
  template: `
    <ng-container *ngIf="isInview" [ngTemplateOutlet]="template">
    </ng-container>
  `,
  styles: [':host {display: block;}']
})
export class MyComponent implements OnInit {
  @ContentChild(TemplateRef) template: TemplateRef<any>;
  @Input() options: any = {threshold: [.1, .2, .3, .4, .5, .6, .7, .8]};
  @Output() inview: EventEmitter<any> = new EventEmitter();
  @Output() notInview: EventEmitter<any> = new EventEmitter();

  observer: IntersectionObserver;
  isInview = false;
  once80PctVisible = false;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: any) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.observer = new IntersectionObserver(this.handleIntersect.bind(this), this.options);
      this.observer.observe(this.element.nativeElement);
    }
  }

  handleIntersect(entries, observer): void {
    entries.forEach((entry: IntersectionObserverEntry) => {
      if (entry['isIntersecting']) {
        this.isInview = true;
        this.defaultInviewHandler(entry);
        this.inview.emit(entry);
      } else {
        this.notInview.emit(entry);
      }
    });
  }

  defaultInviewHandler(entry): any {
    if (this.once80PctVisible)        return false;
    if (this.inview.observers.length) return false;
    // more code hidden
  }
}
