// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { ExampleXComponent } from './exampleX.component';

@Directive({ selector: '[oneviewPermitted]' })
class OneviewPermittedDirective {
  @Input() oneviewPermitted;
}

@Pipe({name: 'translate'})
class TranslatePipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({name: 'phoneNumber'})
class PhoneNumberPipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({name: 'safeHtml'})
class SafeHtmlPipe implements PipeTransform {
  transform(value) { return value; }
}

describe('ExampleXComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        ExampleXComponent,
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        OneviewPermittedDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [

      ]
    }).overrideComponent(ExampleXComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(ExampleXComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #doMore()', async () => {
    component.dtSv = component.dtSv || {};
    component.dtSv.getDtDts4Sh = jest.fn().mockReturnValue({
      rmDt: {},
      ttDt: {}
    });
    component.dvDts = component.dvDts || {};
    component.dvDts.dvDtsNumber = {
      EN: {
        pdTt: {}
      },
      FR: {
        pdTt: {}
      }
    };
    component.foo = component.foo || {};
    component.foo.bar = {
      baz: function() {
        return {
          a: {
            boc: {}
          }
        };
      }
    };
    component.serviceThree = component.serviceThree || {};
    component.serviceThree.open = jest.fn().mockReturnValue({
      usAc: observableOf({})
    });
    component.dates = component.dates || {};
    component.dates = ['dates'];
    component.doMore({
      x: {
        y: {
          z: {
            foo: {
              bar: function() {}
            }
          }
        }
      }
    });
    // expect(component.dtSv.getDtDts4Sh).toHaveBeenCalled();
    // expect(component.serviceThree.open).toHaveBeenCalled();
  });

  it('should run #setFooDddCcc()', async () => {
    component.details = component.details || {};
    component.details.OooPppMmm = {
      fooCdDetails: {
        ccType: {},
        fooBaz: {}
      }
    };
    component.bbbHhh = component.bbbHhh || {};
    component.bbbHhh.getLcDt = jest.fn();
    component.bbbHhh.formatDate = jest.fn();
    component.bbbHhh.isFooDddCcc = jest.fn();
    component.bbbHhh.isFooEeeCcc = jest.fn();
    component.setFooDddCcc();
    // expect(component.bbbHhh.getLcDt).toHaveBeenCalled();
    // expect(component.bbbHhh.formatDate).toHaveBeenCalled();
    // expect(component.bbbHhh.isFooDddCcc).toHaveBeenCalled();
    // expect(component.bbbHhh.isFooEeeCcc).toHaveBeenCalled();
  });

});
