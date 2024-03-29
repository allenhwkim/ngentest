module.exports= `// @ts-nocheck
import { async } from '@angular/core/testing';
import { Observable, of as observableOf, throwError } from 'rxjs';

<%- importMocks.join('\\n') -%>

describe('<%- className %>', () => {
  let obj;

  <%- providerMocks.mocks.join('\\n') %>

  beforeEach(() => {
    obj = new <%- className %>(<%- constructorParamJs %>);
  });

  <% for(var key in accessorTests) { %>
  <%- accessorTests[key] -%>
  <% } %>

  <% for(var key in functionTests) { -%>
  <%- functionTests[key] -%>
  <% } -%>

});`;
