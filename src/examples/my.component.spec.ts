// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {MyComponent} from './my.component';
import {Component, Directive} from '@angular/core';
import {ElementRef, Renderer2, Inject, PLATFORM_ID} from 'lodash';

class MockElementRef extends ElementRef {
  constructor() { super(undefined); }
  nativeElement = {}
}
describe('MyComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MyComponent
      ],
      providers: [
        {provide: ElementRef, useClass: MockElementRef},
        Renderer2,
        {provide: PLATFORM_ID,useValue: 'browser'},
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(MyComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create a component', async () => {
    expect(component).toBeTruthy();
  });
  
    
  it('should run #ngOnInit()', async () => {
    // component.ngOnInit();
  });
        
  it('should run #handleIntersect()', async () => {
    // component.handleIntersect(entries, observer);
  });
        
  it('should run #defaultInviewHandler()', async () => {
    // const result = component.defaultInviewHandler(entry);
  });
        
});
