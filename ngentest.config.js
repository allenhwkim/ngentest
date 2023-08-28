const klassTemplate = require('./src/class/class.template.js');
const componentTemplate = require('./src/component/component.template.js');
const directiveTemplate = require('./src/directive/directive.template.js');
const injectableTemplate = require('./src/injectable/injectable.template.js');
const pipeTemplate = require('./src/pipe/pipe.template.js');

module.exports = {
  framework: 'jest',
  templates: { // .spec file EJS templtes. Update this for differnet format
    klass: klassTemplate,
    component: componentTemplate,
    directive: directiveTemplate,
    injectable: injectableTemplate, 
    pipe: pipeTemplate 
  },
  // necessary directives used for a component test
  directives: [
    'myCustom' // my custom directive used over application
  ], 
  // necessary pipes used for a component test
  pipes: [
    'translate', 'phoneNumber', 'safeHtml'
  ],
  // when convert to JS, some codes need to be replaced to work 
  replacements: [
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
  }
}
