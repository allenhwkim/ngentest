## Functions and modules to use

### To get all `@angular/core` providers
```js
_ => [
  ElementRef,
  NO_ERRORS_SCHEMA,
  PLATFORM_ID,
  Renderer2
];
```
### To get all user-defined functions of a class
```js
function getAllMethodNames(klass) {
  let methods = [];
  let excludes = [
    '__defineGetter__', '__defineSetter__', '__proto__', '__lookupGetter__', '__lookupSetter__',
    'constructor', 'hasOwnProperty', 'valueOf', 'toLocaleString',
    'isPrototypeOf', 'propertyIsEnumerable', 'toString'
  ];
  while (klass = Reflect.getPrototypeOf(klass)) {
    let keys = Reflect.ownKeys(klass)
    keys.forEach( k => {
      !excludes.includes(k) && methods.push(k)
    });
  }
  return methods;
}
```

### To get all parameters of a function
- **parse-function** npm module
```js
const result = app.parse(fixtureFn)
console.log(result.args) // => ['a', 'b', 'c']
```

## Component Unit Test Generator

1. Read As Javascript, import the given component and compile to NodeJS javascript, 
   https://github.com/sinclairzx81/typescript.api#compile
1. Read Typescript. Read the given component file as a string. e.g. my.component.ts
   - get list of constructor parameters and types
      - if parameter is a ElementRef, use Mock
      - if parameter is a user-defined-service, use mock
      - if parameter is with @Inject, use  `{ provide: PLATFORM_ID, useValue: 'browser'}`
1. Get user functions of this component, then create tests.
1. Use this template
```ts
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { 
  <<LIST-OF-PROVIDERS>>
} from '@angular/core';

import { <<COMPONENT-NAME>> } from './ngui-inview.component';

<<MOCK-CLASSES>>

describe('NguiInviewComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [<<COMPONENT-NAME>>  ],
      providers: [
        <<LIST-OF_PROVIDERS>>
      ]
      // schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(<<COMPONENT-NAME>> );
    component = fixture.debugElement.componentInstance;
  });

  it('should create a component', async () => {
    expect(component).toBeTruthy();
  });
  
  <<FUNCTION-TESTS>>
});
```
4. Output the file with .spec.ts


## Directive Unit Test Generator

1. Read As Javascript, using the following, import the given directive and compile to NodeJS javascript, 
   https://github.com/sinclairzx81/typescript.api#compile
1. Read Typescript. Read the given component file as a string. e.g. my.component.ts
   1. get list of constructor parameters and types
      - if parameter is a ElementRef, use Mock
      - if parameter is a user-defined-service, use mock
      - if parameter is with @Inject, use  `{ provide: PLATFORM_ID, useValue: 'browser'}`
   1. get list of @Input and @Outputs
1. Get user functions of this component, then create tests.
1. Use this template
```ts
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { 
  Component,
  NO_ERRORS_SCHEMA,
  <<LIST-OF-PROVIDERS>>
} from '@angular/core';
import {By} from '@angular/platform-browser';

import { <<DIRECTIVE-NAME>> } from './ngui-inview.directive';

<<MOCK-CLASSES>>

@Component({
  template: `
    <div <<INPUT-ATTRIBUTES>> <<OUTPUT-ATTRIBUTES>>></div>
  `
})
class DirectiveTestComponent {
  <<INPUT-PROPERTIES>>
  <<OUTPUT-PROPERTIES>>
}

describe('<<DIRECTIVE-NAME>>', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: DirectiveTestComponent;
  let directiveEl;
  let directive;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [<<DIRECTIVE-NAME>>, DirectiveTestComponent],
      providers: [
        <<LIST-OF_PROVIDERS>>
      ]
      // schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    directiveEl = fixture.debugElement.query(By.directive(<<DIRECTIVE-NAME>>));
    directive = directiveEl.injector.get(<<DIRECTIVE-NAME>>);
  });

  it("should run a directive", async () => {
    expect(component).toBeTruthy();
    expect(directive).toBeTruthy();
  });

  <<FUNCTION-TESTS>>

});
```
