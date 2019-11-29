module.exports = {
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
    { from: 'require\\("html-custom-element"\\)', to: ''}, // some 3rd party require statements causes error, using import or windows directly
    { from: '^\\S+\\.define\\(.*\\);', to: ''} // some commands causes error
  ],
  // with multi file gen, include only these files
  includeMatch: [/(component|directive|pipe|service).ts/],
  // with multi file gen, exclude these files
  excludeMatch: []
}
