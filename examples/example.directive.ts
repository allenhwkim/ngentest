import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  Renderer2,
  ViewChild
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

 @Directive ( {
  selector: '[my]' // tslint:disable-line
})
export class MyDirective implements OnInit, OnDestroy {
  observer: IntersectionObserver;

  /** IntersectionObserver options */
  @Input('item') options: any = {};

  /** Event that will be fired when in viewport */
  @Output('inview') nguiInview: EventEmitter<any> = new EventEmitter();
  /** Event that will be fired when out of  viewport */
  @Output('outview') nguiOutview: EventEmitter<any> = new EventEmitter();

  constructor(
    public element: ElementRef,
    public renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: any) {
  }

  /** Starts IntersectionObserver */
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.observer = new IntersectionObserver(this.handleIntersect.bind(this), this.options);
      this.observer.observe(this.element.nativeElement);
    }
  }

  /** Stops IntersectionObserver */
  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.observer && this.observer.disconnect();
    }
  }

  handleIntersect(entries, observer): void {
    entries.forEach((entry: IntersectionObserverEntry) => {
      if (entry['isIntersecting']) {
        this.nguiInview.emit(entry);
      } else {
        this.nguiOutview.emit(entry);
      }
    });
  }
}
