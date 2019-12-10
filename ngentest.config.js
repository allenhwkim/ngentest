const fs = require('fs');
const path = require('path');
const klassTemplate = fs.readFileSync(path.join(__dirname, 'src', 'class', 'class.template.ts.ejs'), 'utf8');
const componentTemplate = fs.readFileSync(path.join(__dirname, 'src', 'component', 'component.template.ts.ejs'), 'utf8');
const directiveTemplate = fs.readFileSync(path.join(__dirname, 'src', 'directive', 'directive.template.ts.ejs'), 'utf8');
const injectableTemplate = fs.readFileSync(path.join(__dirname, 'src', 'injectable', 'injectable.template.ts.ejs'), 'utf8');
const pipeTemplate = fs.readFileSync(path.join(__dirname, 'src', 'pipe', 'pipe.template.ts.ejs'), 'utf8');

module.exports = {
  // framework: 'karma', // or 'jest'
  // .spec file EJS templtes
  templates: {
    klass: klassTemplate,
    component: componentTemplate,
    directive: directiveTemplate,
    injectable: injectableTemplate, 
    pipe: pipeTemplate 
  },
  // necessary directives used for a component test
  directives: [
    'oneviewPermitted'
  ], 
  // necessary pipes used for a component test
  pipes: [
    'translate', 'phoneNumber', 'safeHtml'
  ],
  // when convert to JS, some codes need to be replaced to work 
  replacements: [
    { from: 'require\\("html-custom-element"\\)', to: '{}'}, // some 3rd party require statements causes error, using import or windows directly
    { from: '^\\S+\\.define\\(.*\\);', to: ''} // some commands causes error
  ],
  // when constructor typs is as following, create a mock class with this properties
  // e.g. @Injectable() MockElementRef { nativeElement = {}; }
  providerMocks: {
    ElementRef: ['nativeElement = {};'],
    Router: ['navigate() {};'],
    Document: ['querySelector() {};'],
    HttpClient: ['post() {};'],
    TranslateService: ['translate() {};'],
    EncryptionService: [],
  },
  // when ngentest runs with a directory, include only these files
  includeMatch: [/(component|directive|pipe|service).ts/],
  // when ngentest runs with a directory, exclude these files
  excludeMatch: []
}
