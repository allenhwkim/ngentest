import { async } from '@angular/core/testing';
import {DynamicComponentService} from './my.service';

describe('DynamicComponentService', () => {
  let service;

  const factoryResolver: any = {
    // mock properties here 
  }

  beforeEach(() => {
    service = new DynamicComponentService(private,factoryResolver);
  });

  it('should run #createComponent()', async () => {
    // const result = createComponent(component, into);
  });

  it('should run #insertComponent()', async () => {
    // const result = insertComponent(componentRef);
  });

  it('should run #emptyFunction()', async () => {
    // const result = emptyFunction();
  });

});
