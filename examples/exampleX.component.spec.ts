// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { TotalDataDetailsComponent } from './exampleX.component';

@Directive({ selector: '[oneviewPermitted]' })
class OneviewPermittedDirective {
  @Input() oneviewPermitted;
}

@Pipe({name: 'serviceFive'})
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

describe('TotalDataDetailsComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        TotalDataDetailsComponent,
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        OneviewPermittedDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [

      ]
    }).overrideComponent(TotalDataDetailsComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(TotalDataDetailsComponent);
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
    component.dataService = component.dataService || {};
    component.dataService.getDataDetailsForSharing = jest.fn().mockReturnValue({
      remainingData: {},
      totalData: {}
    });
    component.deviceDetails = component.deviceDetails || {};
    component.deviceDetails.deviceDetailsNumber = {
      EN: {
        productTitle: {}
      },
      FR: {
        productTitle: {}
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
    component.ServiceThree = component.ServiceThree || {};
    component.ServiceThree.open = jest.fn().mockReturnValue({
      userAction: observableOf({})
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
    // expect(component.dataService.getDataDetailsForSharing).toHaveBeenCalled();
    // expect(component.ServiceThree.open).toHaveBeenCalled();
  });

  it('should run #setFooDddCcc()', async () => {
    component.details = component.details || {};
    component.details.OooPppMmm = {
      fooCardDetails: {
        ccType: {},
        fooBaz: {}
      }
    };
    component.bbbHhh = component.bbbHhh || {};
    component.bbbHhh.getLocalDate = jest.fn();
    component.bbbHhh.formatDate = jest.fn();
    component.bbbHhh.isFooDddCcc = jest.fn();
    component.bbbHhh.isFooEeeCcc = jest.fn();
    component.setFooDddCcc();
    // expect(component.bbbHhh.getLocalDate).toHaveBeenCalled();
    // expect(component.bbbHhh.formatDate).toHaveBeenCalled();
    // expect(component.bbbHhh.isFooDddCcc).toHaveBeenCalled();
    // expect(component.bbbHhh.isFooEeeCcc).toHaveBeenCalled();
  });

});
