# ngentest
Angular5+ Unit Test Generator For Components, Directive, Services, and Pipes

## How It Works
1. Parse component/directive/service, then prepare the following data.
    - className
    - imports
    - input/output attributes and properties
    - mocks
    - providers for TestBed
    - list of functions to test
2. Generate unit test from prepared data with .ejs template

## Install & Run
```
$ npm install ngentest -g # to run this command anywhere
$ ngentest my.component.ts # node_modules/.bin/gentest
$ ngentest my.directive.ts -s # write unit test to my.directive.spec.ts
$ ngentest my.pipe.ts > my.pipe.test.ts 
$ ngentest my.service.ts
```

## Examples
### component unit test  generated
[my.component.ts](./src/examples/my.component.ts)
```
$ gentest my.component.ts > my.component.spec.ts
```
my.component.spec.ts
```
// tslint:disble
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {MyComponent} from './src/examples/my.component';
import {Directive, ElementRef, Renderer2, Inject, PLATFORM_ID} from '@angular/core';

@Injectable()
class MockElementRef  {
  // constructor() { super(undefined); }
  nativeElement = {}
}
(<any>window).IntersectionObserver = jest.fn();

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
    // ngOnInit();
  });

  it('should run #handleIntersect()', async () => {
    // handleIntersect(entries, observer);
  });

  it('should run #defaultInviewHandler()', async () => {
    // const result = defaultInviewHandler(entry);
  });

});
```

### directive unit test  generated
[my.directive.ts](./src/examples/my.directive.ts)
```bash
$ gentest my.directive.ts > my.directrive.spec.ts
```
my.directive.spec.ts
```
// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {MyDirective} from './src/examples/my.directive';
import {Directive, ElementRef, Renderer2, Inject, PLATFORM_ID} from '@angular/core';

@Injectable()
class MockElementRef {
  // constructor() { super(undefined); }
  nativeElement = {}
}
(<any>window).IntersectionObserver = jest.fn();

@Component({
  template: `
    <div [options]="options" (nguiInview)="onNguiInview($event)" (nguiOutview)="onNguiOutview($event)"></div>
  `
})
class DirectiveTestComponent {
  options: any;

  onNguiInview(event): void { /* */ }
  onNguiOutview(event): void { /* */ }
}

describe('MyDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
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
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    directiveEl = fixture.debugElement.query(By.directive(MyDirective));
    directive = directiveEl.injector.get(MyDirective);
  });

  it("should run a directive", async () => {
    expect(component).toBeTruthy();
    expect(directive).toBeTruthy();
  });


  it('should run #ngOnInit()', async () => {
    // ngOnInit();
  });

  it('should run #ngOnDestroy()', async () => {
    // ngOnDestroy();
  });

  it('should run #handleIntersect()', async () => {
    // handleIntersect(entries, observer);
  });

});
```

### service unit test generated
[my.service.ts](./src/examples/my.service.ts)
```bash
$ gentest my.service.ts > my.service.spec.ts
```
my.directive.spec.ts
```
import {DynamicComponentService} from './src/examples/my.service';

describe('DynamicComponentService', () => {
  let service;


  const factoryResolver = {
    // mock properties here
  }

  beforeEach(() => {
    service = new DynamicComponentService(factoryResolver);
  });


  it('should run #createComponent()', async () => {
    // const result = createComponent(component, into);
  });

  it('should run #insertComponent()', async () => {
    // const result = insertComponent(componentRef);
  });

});
```

### pipe unit test generated
[my.pipe.ts](./src/examples/my.pipe.ts)
```bash
$ gentest my.pipe.ts > my.pipe.spec.ts
```
my.pipe.spec.ts
```
import {NguiHighlightPipe} from './src/examples/my.pipe';

describe('NguiHighlightPipe', () => {

  it('should run #transform', () => {
    // const pipe = new NguiHighlightPipe();
    // const result = pipe.transform(text, search);
    // expect(result).toBe('<<EXPECTED>>');
  });

});
```

