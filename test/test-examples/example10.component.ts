import { Component, ViewEncapsulation, Inject, OnInit } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import {A, B} from 'src/app/foo/bar';

declare var jQuery: any;
declare var tinyMCE: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(
    @Inject(APP_BASE_HREF) readonly href: string,
    a: A,
    b: B
  ) { }

  public ngOnInit(): any {
    window['Pace'].on('start' , () => jQuery('.spinner').show());
    window['Pace'].on('done'  , () => jQuery('.spinner').hide());
    tinyMCE.baseURL = `${this.href}assets/js/tiny_mce`;
  }

}