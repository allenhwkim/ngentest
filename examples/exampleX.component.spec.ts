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
    component.dialogService = component.dialogService || {};
    component.dialogService.open = jest.fn().mockReturnValue({
      userAction: observableOf({})
    });
    component.doMore({
      x: {
        y: {
          z: {
            foo: {
              bar: jest.fn()
            }
          }
        }
      }
    });
    expect(component.dataService.getDataDetailsForSharing).toHaveBeenCalled();
    expect(component.dialogService.open).toHaveBeenCalled();
  });

  it('should run #setCreditCardDetails()', async () => {
    component.billingDetails = component.billingDetails || {};
    component.billingDetails.methodOfPayment = {
      creditCardDetails: {
        ccType: {},
        ccExpiry: {}
      }
    };
    component.billingHeader = component.billingHeader || {};
    component.billingHeader.getLocalDate = jest.fn();
    component.billingHeader.formatDate = jest.fn();
    component.billingHeader.isCreditCardExpired = jest.fn();
    component.billingHeader.isCreditCardExpiring = jest.fn();
    component.setCreditCardDetails();
    expect(component.billingHeader.getLocalDate).toHaveBeenCalled();
    expect(component.billingHeader.formatDate).toHaveBeenCalled();
    expect(component.billingHeader.isCreditCardExpired).toHaveBeenCalled();
    expect(component.billingHeader.isCreditCardExpiring).toHaveBeenCalled();
  });

});
