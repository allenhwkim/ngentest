Input Codes(related @Input)
  . attributes. html-related codes. e.g., `[my-attr]="myAttr"` 
  . properties, JS-related codes. e.g.,   `myAttr: DirectiveTestComponent`

Output Codes(related @Output)
  . attributes. html-related codes. e.g., `(onButtonPressed)="callMyFunc($event)"`
  . properties. JS-related codes. e.g., `callMyFunc(event): void { /* */ }`

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
1. Output the file with .spec.ts

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
