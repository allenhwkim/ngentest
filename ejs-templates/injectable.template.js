module.exports = `// @ts-nocheck
import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf, throwError } from 'rxjs';

<%- importMocks.join('\\n') -%>

<%- providerMocks.mocks.join('\\n') %>

describe('<%- className %>', () => {
  let service;

  beforeEach(() => {
    service = new <%- className %>(<%- constructorParamJs %>);
  });

  <% for(var key in functionTests) { -%>
  <%- functionTests[key] -%>
  <% } -%>

});`
