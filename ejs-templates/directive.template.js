module.exports = `// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Injectable, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

<%- importMocks.join('\\n') -%>

<%- providerMocks.mocks.join('\\n') %>

@Component({
  template: \`
<% if (selector.type === 'element') { -%>
  <<%- selector.name -%> <%- inputMocks.html.join(' ') -%> <%- outputMocks.html.join(' ') -%>></<%- selector.name %>>
<% } else if (selector.type === 'attribute') { -%>
  <div <%- selector.name -%> <%- inputMocks.html.join(' ') -%> <%- outputMocks.html.join(' ') -%>></div>
<% } else if (selector.type === 'class') { -%>
  <div class="<%- selector.name -%>" <%- inputMocks.html.join(' ') -%> <%- outputMocks.html.join(' ') -%>></div>
<% } -%>
  \`
})
class DirectiveTestComponent {
<% inputMocks.js.forEach(function(prop) { -%>
  <%- prop -%>
<% }) %>
<% outputMocks.js.forEach(function(prop) { %>
  <%- prop -%>
<% }) %>
}

describe('<%- className %>', () => {
  let fixture: ComponentFixture<DirectiveTestComponent>;
  let component: DirectiveTestComponent;
  let directiveEl;
  let directive;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [<%- className %>, DirectiveTestComponent],
      providers: [
        <%- providerMocks.providers.join(',\\n        ') %>
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();
    fixture = TestBed.createComponent(DirectiveTestComponent);
    component = fixture.componentInstance;
    directiveEl = fixture.debugElement.query(By.directive(<%- className %>));
    directive = directiveEl.injector.get(<%- className %>);
  });

  it("should run a directive", async () => {
    expect(component).toBeTruthy();
    expect(directive).toBeTruthy();
  });

  <% for(var key in functionTests) { -%>
  <%- functionTests[key] -%>
  <% } -%>

});`;
