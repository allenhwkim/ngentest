# ngentest
Angular5+ Unit Test Generator For Components, Directive, Services, and Pipes

## Install & Run
```
$ npm install ngentest -g # to run this command anywhere
$ ngentest -h
Usage: index.js <tsFile> [options]

Options:
  --version      Show version number                                   [boolean]
  -s, --spec     write the spec file along with source file            [boolean]
  -f, --force    Do not ask question when overwrite spec file          [boolean]
  -v, --verbose  log verbose debug messages                            [boolean]
  -h             Show help                                             [boolean]
$ ngentest my.component.ts # node_modules/.bin/gentest
$ ngentest my.directive.ts -s # write unit test to my.directive.spec.ts
$ ngentest my.pipe.ts > my.pipe.test.ts 
$ ngentest my.service.ts
```

## How It works 

1. Get data for test generation from typescript.

    * inputs
    * outputs
    * providers
    * imports
    * selector (for directive only)
    * constructor params
    * provider mocks

1. For each function in a class, generate function test and save it as function tests by

    * generating function mock codes
    * generating function call codes
    * generating test assert codes

1. Run EJS template with data to generate tests

## Data Used For Test Generation

### inputs
Input Codes(related @Input)

  * attributes. html-related codes. e.g., `[my-attr]="myAttr"` 
  * properties, JS-related codes. e.g.,   `myAttr: DirectiveTestComponent`

### outputs
Output Codes(related @Output)

  * attributes. html-related codes. e.g., `(onButtonPressed)="callMyFunc($event)"`
  * properties. JS-related codes. e.g., `callMyFunc(event): void { /* */ }`

### imports
Import Codes(related import statement. grouped by library name)  e.g.,
```
  {
    '@angular/core': ['Component', 'Directive', 'Input', 'Output', 'Foo as myFoo']
  }
```

### providers
Module Provider Statement Codes. Keys are constructo variable names . e.g.,
```
  {
    'document' : `{ provide: DOCUMENT, useClass: MockDocument }`,
    'platform' : `{ provide: 'PLATFORM_ID', useValue: 'browser' }`,
    'language' : `{ provide: 'LOCALE_ID', useValue: 'en' }`,
    'myService' : `{ provide: MyService, useClass: MockMyService }`
  }
```

### provider mocks
Mock code for constructor with its properties/functions as an array. e.g.,
```
  {
    ElementRef: ['nativeElement = {};'],
    Router: ['navigate = jest.fn();'],
    Document: ['querySelector = jest.fn();'],
    MyService: []
  }
```

### class imports (Used internally)
Import info. from parsed typescript-parser. e.g., 
```
  {
    ElementRef: {
      import: {
        libraryName: '@angular/core',
        alias: 'foo'
      },
      specifier: {
        specifier: 'ElementRef',
        alias: 'elRef'
      }
    },
  }
```

## For Developers: To make it sure it does not break any feature

There are example directory under `src/for-*`. The example directory has typescript files and its generated spec files.
The generaged spec files are the last output of the generated test, e.g., `src/for-component/example/example.component.spec.ts`.

Whenever you change the code, run `npm test`. This will run `./test.js` and compare the output of generated test and the file which is saved last time.

If you are satisfied the result, regenerate spec files and save it by running `sh all-examples.sh`.




