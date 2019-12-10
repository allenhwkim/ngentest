// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Injectable, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component, ElementRef, Renderer2, PLATFORM_ID } from '@angular/core';
import { MyDirective } from './example.directive';

@Injectable()
class MockElementRef {
  nativeElement = {};
}

@Component({
  template: `
  <div my [item]="options" (inview)="onNguiInview($event)" (outview)="onNguiOutview($event)"></div>
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
        { provide: ElementRef, useClass: MockElementRef },
        Renderer2,
        { provide: 'PLATFORM_ID', useValue: 'browser' }
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
    directive.handleIntersect = directive.handleIntersect || {};
    directive.handleIntersect.bind = jest.fn();
    directive.observer = directive.observer || {};
    directive.observer.observe = jest.fn();
    directive.element = directive.element || {};
    directive.element.nativeElement = 'nativeElement';
    directive.ngOnInit();
    // expect(directive.handleIntersect.bind).toHaveBeenCalled();
    // expect(directive.observer.observe).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    directive.observer = directive.observer || {};
    directive.observer.disconnect = jest.fn();
    directive.ngOnDestroy();
    // expect(directive.observer.disconnect).toHaveBeenCalled();
  });

  it('should run #handleIntersect()', async () => {
    directive.nguiInview = directive.nguiInview || {};
    directive.nguiInview.emit = jest.fn();
    directive.nguiOutview = directive.nguiOutview || {};
    directive.nguiOutview.emit = jest.fn();
    directive.handleIntersect([{}], {});
    // expect(directive.nguiInview.emit).toHaveBeenCalled();
    // expect(directive.nguiOutview.emit).toHaveBeenCalled();
  });

});
