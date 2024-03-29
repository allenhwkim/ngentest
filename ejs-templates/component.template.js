module.exports = `// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

<%- importMocks.join('\\n') -%>

<%- providerMocks.mocks.join('\\n') %>

<% (config.requiredComponentTestDeclarations.directives || config.directives).forEach(directive => { %>
@Directive({ selector: '[<%- directive -%>]' })
class <%- directive.charAt(0).toUpperCase() + directive.slice(1) -%>Directive {
  @Input() <%- directive -%>;
}
<% }) -%>

<% (config.requiredComponentTestDeclarations.pipes || config.pipes).forEach(pipe => { %>
@Pipe({name: '<%- pipe -%>'})
class <%- pipe.charAt(0).toUpperCase() + pipe.slice(1) -%>Pipe implements PipeTransform {
  transform(value) { return value; }
}
<% }) -%>

describe('<%- className %>', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        <%- className %>,
        <%- (config.requiredComponentTestDeclarations.pipes || config.pipes).map(e => e.charAt(0).toUpperCase() + e.slice(1) + 'Pipe').join(', ') %>,
        <%- (config.requiredComponentTestDeclarations.directives || config.directives).map(e => e.charAt(0).toUpperCase() + e.slice(1) + 'Directive').join(', ') %>
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        <%- providerMocks.providers.join(',\\n        ') %>
      ]
    }).overrideComponent(<%- className %>, {
    <% componentProviderMocks.forEach(mock => { %>
      <%- mock -%>
    <% }) %>
    }).compileComponents();
    fixture = TestBed.createComponent(<%- className %>);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  <% for(var key in accessorTests) { %>
  <%- accessorTests[key] -%>
  <% } %>
  
  <% for(var key in functionTests) { %>
  <%- functionTests[key] -%>
  <% } %>
  
});`;
