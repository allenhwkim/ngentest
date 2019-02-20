// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { By } from '@angular/platform-browser';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/of';
// import 'rxjs/add/observable/throw';

import {Component, Directive, ElementRef, Renderer2, Inject, PLATFORM_ID} from '@angular/core';
import {MyDirective} from './my.directive';

@Injectable()
class MockElementRef {
  // constructor() { super(undefined); }
  nativeElement = {}
}
(<any>window).IntersectionObserver = jest.fn();

@Component({
  template: `
    <DIRECTIVE-SELECTOR [item]="options" (inview)="onNguiInview($event)" (outview)="onNguiOutview($event)"></DIRECTIVE-SELECTOR>
  `
})
class DirectiveTestComponent {
  options: any;

  onNguiInview(event): void { /* */ }
  onNguiOutview(event): void { /* */ }
}

describe('MyDirective', () => {
  let fixture: ComponentFixture<DirectiveTestComponent>;
  let component: DirectiveTestComponent;
  let directiveEl;
  let directive;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [MyDirective, DirectiveTestComponent],
      providers: [
        {provide: ElementRef, useClass: MockElementRef},
        Renderer2,
        {provide: PLATFORM_ID,useValue: 'browser'},
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();
    fixture = TestBed.createComponent(DirectiveTestComponent);
    component = fixture.componentInstance;
    directiveEl = fixture.debugElement.query(By.directive(MyDirective));
    directive = directiveEl.injector.get(MyDirective);
  });

  it("should run a directive", async () => {
    expect(component).toBeTruthy();
    expect(directive).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    // directive.ngOnInit();
  });

  it('should run #ngOnDestroy()', async () => {
    // directive.ngOnDestroy();
  });

  it('should run #handleIntersect()', async () => {
    // directive.handleIntersect(entries, observer);
  });

});
