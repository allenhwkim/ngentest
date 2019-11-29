// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { ChangePlanComponent } from './example7.component';
import { DialogService } from '@rogers/oneview-components';
import { ChangePlanDataService } from './change-plan-data.service';
import { NavigationService } from './../../framework/navigation.service';

@Injectable()
class MockChangePlanDataService {}

@Injectable()
class MockNavigationService {}

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

describe('ChangePlanComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        ChangePlanComponent,
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        OneviewPermittedDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        DialogService,
        { provide: ChangePlanDataService, useClass: MockChangePlanDataService },
        { provide: NavigationService, useClass: MockNavigationService }
      ]
    }).overrideComponent(ChangePlanComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(ChangePlanComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #changePricePlan()', async () => {
    component.changePlanData = component.changePlanData || {};
    component.changePlanData.getPrimaryPhoneNumber = jest.fn();
    component.changePlanData.getPPCSubscribers = jest.fn().mockReturnValue(observableOf({}));
    component.changePlanData.checkifMultiorSingle = jest.fn();
    component.changePlanData.getActiveSubs = jest.fn();
    component.changePlanData.getPrimaryNumberShareStatus = jest.fn();
    component.changePlanData.hasActiveAdditionalSubs = jest.fn();
    component.changePlanData.getMainSub = jest.fn();
    component.changePlanData.getSingleSubNumber = jest.fn();
    component.setEligibilityAndStatePostData = jest.fn();
    component.getIndividualSubPostData = jest.fn();
    component.getEligibility = jest.fn();
    component.eligiblePostData = component.eligiblePostData || {};
    component.eligiblePostData.subNumber = 'subNumber';
    component.eligiblePostData.flowType = 'flowType';
    component.statePostData = component.statePostData || {};
    component.statePostData.eligibilityChecked = 'eligibilityChecked';
    component.saveStateAndChangePlan = jest.fn();
    await component.changePricePlan();
    expect(component.changePlanData.getPrimaryPhoneNumber).toHaveBeenCalled();
    expect(component.changePlanData.getPPCSubscribers).toHaveBeenCalled();
    expect(component.changePlanData.checkifMultiorSingle).toHaveBeenCalled();
    expect(component.changePlanData.getActiveSubs).toHaveBeenCalled();
    expect(component.changePlanData.getPrimaryNumberShareStatus).toHaveBeenCalled();
    expect(component.changePlanData.hasActiveAdditionalSubs).toHaveBeenCalled();
    expect(component.changePlanData.getMainSub).toHaveBeenCalled();
    expect(component.changePlanData.getSingleSubNumber).toHaveBeenCalled();
    expect(component.setEligibilityAndStatePostData).toHaveBeenCalled();
    expect(component.getIndividualSubPostData).toHaveBeenCalled();
    expect(component.getEligibility).toHaveBeenCalled();
    expect(component.saveStateAndChangePlan).toHaveBeenCalled();
  });

  it('should run #getEligibility()', async () => {
    component.changePlanData = component.changePlanData || {};
    component.changePlanData.getPPCEligibility = jest.fn().mockReturnValue(observableOf({}));
    component.changePlanData.formatEligibilityErrorCode = jest.fn();
    component.checkIfBOTEligible = jest.fn();
    component.dialog = component.dialog || {};
    component.dialog.open = jest.fn();
    await component.getEligibility({}, {});
    expect(component.changePlanData.getPPCEligibility).toHaveBeenCalled();
    expect(component.changePlanData.formatEligibilityErrorCode).toHaveBeenCalled();
    expect(component.checkIfBOTEligible).toHaveBeenCalled();
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('should run #checkIfBOTEligible()', async () => {
    component.statePostData = component.statePostData || {};
    component.statePostData.availableCreditAmount = 'availableCreditAmount';
    component.changePlanData = component.changePlanData || {};
    component.changePlanData.getCases = jest.fn().mockReturnValue(observableOf({}));
    component.changePlanData.getPendingCases = jest.fn();
    component.changePlanData.closeCase = jest.fn().mockReturnValue(observableOf({}));
    component.dialog = component.dialog || {};
    component.dialog.open = jest.fn();
    component.saveStateAndChangePlan = jest.fn();
    await component.checkIfBOTEligible({
      availableCreditAmount: '[object Object]'
    });
    expect(component.changePlanData.getCases).toHaveBeenCalled();
    expect(component.changePlanData.getPendingCases).toHaveBeenCalled();
    expect(component.changePlanData.closeCase).toHaveBeenCalled();
    expect(component.dialog.open).toHaveBeenCalled();
    expect(component.saveStateAndChangePlan).toHaveBeenCalled();
  });

  it('should run #saveStateAndChangePlan()', async () => {
    component.changePlanData = component.changePlanData || {};
    component.changePlanData.savePPCState = jest.fn().mockReturnValue(observableOf({}));
    component.navigation = component.navigation || {};
    component.navigation.changeRoute = jest.fn();
    await component.saveStateAndChangePlan();
    expect(component.changePlanData.savePPCState).toHaveBeenCalled();
    expect(component.navigation.changeRoute).toHaveBeenCalled();
  });

  it('should run #getIndividualSubPostData()', async () => {
    component.changePlanData = component.changePlanData || {};
    component.changePlanData.hasActiveMain = jest.fn();
    component.changePlanData.hasOtherIndividualSubs = jest.fn();
    component.changePlanData.getIndSubPostData = 'getIndSubPostData';
    component.changePlanData.getMainSub = jest.fn();
    component.changePlanData.getActiveAdditionalSubsWithPrimary = jest.fn();
    component.changePlanData.getOtherIndividualSubs = jest.fn();
    component.dialog = component.dialog || {};
    component.dialog.open = jest.fn();
    await component.getIndividualSubPostData({}, {});
    expect(component.changePlanData.hasActiveMain).toHaveBeenCalled();
    expect(component.changePlanData.hasOtherIndividualSubs).toHaveBeenCalled();
    expect(component.changePlanData.getMainSub).toHaveBeenCalled();
    expect(component.changePlanData.getActiveAdditionalSubsWithPrimary).toHaveBeenCalled();
    expect(component.changePlanData.getOtherIndividualSubs).toHaveBeenCalled();
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('should run #setEligibilityAndStatePostData()', async () => {
    component.eligiblePostData = component.eligiblePostData || {};
    component.eligiblePostData.x = 'x';
    component.statePostData = component.statePostData || {};
    component.statePostData.x = 'x';
    component.setEligibilityAndStatePostData({
      subNumber: '[object Object]',
      flowType: '[object Object]',
      filterOption: '[object Object]',
      selectAdditionalSubscribers: '[object Object]'
    });

  });

});
