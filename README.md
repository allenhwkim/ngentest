# ngentest
Angular5,6,7,8+ Unit Test Generator For Components, Directive, Services, and Pipes

## Install & Run
```
$ npm install ngentest -g # to run this command anywhere
$ ngentest my.component.ts 
$ ngentest my.directive.ts -s # write unit test to my.directive.spec.ts
```

To see the source file and generated examples, please take a look at examples directory.

## Config
You can override configuration by creating a file named as `ngentest.config.js` in your application directory.

  * framework: `jest` or `karma`. The default is `jest`. This value determines how function mock and assert is to be done.

  * templates: template string for each type. Please specify your own template if you want to override
    the default template. There are five types;
    * klass: An ES6 class without angular decorator
    * component: A class with @Component decorato
    * directive: A class with @Directive decoratorr
    * injectable: A class with @Injectable decoratorr
    * pipe: A class with @Pipe decoratorr

    e.g., 
    ```
    templates: {
      klass: myKlassTemplate,
      component: myComponentTemplate,
      directive: myDirectiveTemplate,
      injectable: myInjectableTemplate, 
      pipe: myPipeTemplate 
    }
    ```

  * directives: Array of diretive names used for a component test. e.g., 
    ```
    directives: ['myDirective']
    ```

  * pipes: Array of pipe names used for a component test. e.g. 
    ```
    pipes: ['translate', 'phoneNumber', 'safeHtml']
    ```

  * replacements: There are some codes, which causes error without proper environment. You need to replace these codes.
    You can specify `from` value with regular expression and `to` value with string.
    e.g. 
    ```
    replacements: [
      { from: '^\\S+\\.define\\(.*\\);', to: ''}`
    ]
    ```

  * providerMocks: When the following class is used in a constructor, create a mock class with the given statements.
    e.g.
    ```
    providerMocks: {
      ElementRef: ['nativeElement = {};'],
      Router: ['navigate() {};'],
      Document: ['querySelector() {};'],
      HttpClient: ['post() {};'],
      TranslateService: ['translate() {};'],
      EncryptionService: [],
    }
    ```

  * includeMatch: When ngentest runs with a directory, include only these files. e.g.,
    ```
    includeMatch: [/(component|directive|pipe|service).ts/],
    ````
  
  * excludeMatch: When ngentest runs with a directory, exclude these files. e.g., 
    ```
    excludeMatch: [/.*module.ts$/]
    ```

## How It works

1. Parse a Typescript file and find these info.
  * imports: imports statements info.
  * inputs: @Input statements info.
  * outputs: @Output statements info.
  * component provider: providers info used in @Component decorator.
  * selector: selector info used in @Component or @Directove decorator.

2. Compile Typescript to Javascript, then get the following info.
  * constructor param data
  * provider mock data
  * accessor tests
  * function tests

3. build ejs data from #1 and #2, and generate test code.

## For Developers: To make it sure it does not break any feature

Genearate spec files for all examples and compare if there is any difference.
```
$ sh tools/all-examples.sh
$ git diff
```