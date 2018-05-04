## Component Unit Test Generator

1. Read As Javascript, import the given component and compile to NodeJS javascript, 
   https://github.com/sinclairzx81/typescript.api#compile
1. Read Typescript. Read the given component file as a string. e.g. my.component.ts
   1. get list of constructor parameters and types
   1. if parameter is a ElementRef, use Mock
   1. if parameter is a user-defined-service, use mock
   1. if parameter is with @Inject, use  `{ provide: PLATFORM_ID, useValue: 'browser'}`
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

  it('should create a component', async(() => {
    expect(component).toBeTruthy();
  }));
  
  <<FUNCTION-TESTS>>
});
```
4. Output the file with .spec.ts

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
