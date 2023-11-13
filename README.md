# ngentest
Angular6,7,8,9,10,11,12,13,14,15,16 Unit Test Generator For Components, Directive, Services, and Pipes

## Install & Run
```bash
$ npm install ngentest -D
$ npx ngentest -h          
Usage: index.js <tsFile> [options]

Options:
      --version     Show version number                                [boolean]
  -s, --spec        write the spec file along with source file         [boolean]
  -f, --force       It prints out a new test file, and it does not ask a
                    question when overwrite spec file                  [boolean]
  -v, --verbose     log verbose debug messages                         [boolean]
      --framework   test framework, jest or karma                       [string]
  -c, --config      The configuration file to load options from
                                        [string] [default: "ngentest.config.js"]
  -h                Show help                                          [boolean]

Examples:
  index.js my.component.ts  generate Angular unit test for my.component.ts

$ npx ngentest my.component.ts 
$ npx ngentest my.directive.ts -s # write unit test to my.directive.spec.ts
$ npx ngentest my.directive.ts -c ../ngentest.config.js # use different config file.
```

To see the source file and generated examples, please take a look at `test-examples` directory.
https://github.com/allenhwkim/ngentest/tree/master/test-examples

## Config
You can override configuration by creating a file named as `ngentest.config.js` in your application directory and running ngentest from that directory. You can also provide a configuration file using `-c my.config.js`.
If you want to use your own config, refer [the default config file](https://github.com/allenhwkim/ngentest/blob/main/ngentest.config.js)

  * **framework**: `jest` or `karma`. The default is `jest`. This value determines how function mock and assert is to be done.

  * **outputTemplates**: template string for each type. Please specify your own template if you want to override the default template. There are five types;
    * klass: ejs template for an ES6 class without angular decorator.
    * component: ejs template for an Angular component.
    * directive: ejs template for an Angular directive.
    * injectable: ejs template for an Angular service.
    * pipe: ejs template for an Angular pipe.

    e.g., 
    ```javascript
    outputTemplates: {
      klass: myKlassTemplate, 
      component: myComponentTemplate,
      directive: myDirectiveTemplate,
      injectable: myInjectableTemplate, 
      pipe: myPipeTemplate 
    }
    ```

  * **directives**: Array of diretive names, necessary for a component test. e.g., 
    ```javascript
    directives: ['myDirective']
    ```

  * **pipes**: Array of pipe names, necessary for a component test. e.g. 
    ```javascript
    pipes: ['translate', 'phoneNumber', 'safeHtml']
    ```

  * **replacements**: There are some codes, which causes error without proper environment. You need to replace these codes.
    You can specify `from` value with regular expression and `to` value with string.
    e.g. 
    ```javascript
    replacements: [
      { from: '^\\S+\\.define\\(.*\\);', to: ''}`
    ]
    ```

  * **providerMocks**: When the following class is used in a constructor parameter, create a mock class with the given statements.
    e.g.
    ```javascript
    providerMocks: {
      ElementRef: ['nativeElement = {};'],
      Router: ['navigate() {};'],
      Document: ['querySelector() {};'],
      HttpClient: ['post() {};'],
      TranslateService: ['translate() {};'],
      EncryptionService: [],
    }
    ```

  ### Full Example (https://github.com/allenhwkim/ngentest/blob/master/ngentest.config.js)
  ```javascript
  module.exports = {
    framework: 'karma', // or 'jest'
    outputTemplates: {
      klass: klassTemplate,  // ejs contents read from file
      component: componentTemplate,
      directive: directiveTemplate,
      injectable: injectableTemplate, 
      pipe: pipeTemplate 
    },
    // necessary directives used for a component test
    directives: [
      // 'myCustomDirective' // my custom directive used over application
    ], 
    // necessary pipes used for a component test
    pipes: [
      'translate', 'phoneNumber', 'safeHtml'
    ],
    // when convert to JS, some codes need to be replaced to work 
    replacements: [ // some 3rd party module causes an error
      { from: '^\\S+\\.define\\(.*\\);', to: ''} // some commands causes error
    ],
    // when constructor param type is as following, create a mock class with this properties
    // e.g. @Injectable() MockElementRef { nativeElement = {}; }
    providerMocks: {
      ElementRef: ['nativeElement = {};'],
      Router: ['navigate() {};'],
      Document: ['querySelector() {};'],
      HttpClient: ['post() {};'],
      TranslateService: ['translate() {};'],
      EncryptionService: [],
    }
  }
  ```

## How It works

1. Parse a Typescript file and find these info.

    * imports: imports statements info.
    * inputs: @Input statements info.
    * outputs: @Output statements info.
    * component provider: providers info used in @Component decorator.
    * selector: selector info used in @Component or @Directove decorator.

2. Compile Typescript to Javascript, then parse the Javascript, and get the following info.

    * constructor param data
    * provider mock data
    * accessor tests
    * function tests

3. build ejs data from #1 and #2, and generate test code.

## For Developers: 

### Directory structure
* `api` directory:
  - source code to run this as an API
  - To run local express server, `node api/express-server.js`
  - `api/index.js` is a structure [used by Vercel](https://vercel.com/guides/using-express-with-vercel#standalone-express)

* `ejs-template` directory:
  - default EJS templates for unit test generation
* `test` directory:
  - All test files including unit test goes here
* `cli.js`: 
  - used as `ngentest` command
* `ngentest.config.js`: 
  - The default configuration file used by `cli.js`
* `vercel.json`: 
  - Used to deploy to `https://ngentest.vercel.com/api/ngentest`
 
### Deployment to Vercel
Whenever `main` branch is updated, API `https://ngentest.vercel.app/api/ngentest` will be deployed.  
Deployment setting: https://vercel.com/allenhwkim/ngentest/Dd16oSozmEMdqy7wozeYPHdPiCmd  
Project setting https://vercel.com/allenhwkim/ngentest  

### To make it sure it does not break any feature
```
$ npm i

$ npm test
> ngentest@2.1.1 test
> node --test test/*.spec.js && node test/index.js
▶ TypescriptParser
...
▶ Util
...
passed check /Users/allenkim/projects/ngentest/test/test-examples/example.klass.ts
passed check /Users/allenkim/projects/ngentest/test/test-examples/example.component.ts
passed check /Users/allenkim/projects/ngentest/test/test-examples/example2.component.ts
passed check /Users/allenkim/projects/ngentest/test/test-examples/example3.component.ts
passed check /Users/allenkim/projects/ngentest/test/test-examples/example4.component.ts
passed check /Users/allenkim/projects/ngentest/test/test-examples/example5.component.ts
passed check /Users/allenkim/projects/ngentest/test/test-examples/example6.component.ts
passed check /Users/allenkim/projects/ngentest/test/test-examples/example7.component.ts
passed check /Users/allenkim/projects/ngentest/test/test-examples/example8.component.ts
passed check /Users/allenkim/projects/ngentest/test/test-examples/example9.component.ts
passed check /Users/allenkim/projects/ngentest/test/test-examples/exampleX.component.ts
passed check /Users/allenkim/projects/ngentest/test/test-examples/example.directive.ts
passed check /Users/allenkim/projects/ngentest/test/test-examples/example.service.ts
passed check /Users/allenkim/projects/ngentest/test/test-examples/example.pipe.ts
passed check /Users/allenkim/projects/ngentest/test/test-examples/example2.pipe.ts

```

