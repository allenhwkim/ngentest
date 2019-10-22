import * as path from 'path';
import { DynamicModule, Injectable, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { NgTestWriter } from './ng-test-writer';

async function getImports(tsParamPath) {
  const tsPath = path.resolve(tsParamPath);
  const testWriter = new NgTestWriter(tsPath);
  const testGenerator: any = testWriter.getTestGenerator(); // get test generator. e.g. ComponentData
  const ejsData = await testGenerator.getEjsData(); // parse typescript

  // find imports from constructor parameters, providers
  // import each class dynamically. https://mariusschulz.com/blog/dynamic-import-expressions-in-typescript
  const imports = await Promise.all(
    Object.keys(ejsData.providers).map( async function(klassName) {
      const provider = ejsData.providers[klassName];
      const iimport = testGenerator.imports[klassName];
      const libName = iimport.mport.libraryName.match(/^\./) ? // if userPath, recalculate path
        path.join(path.dirname(tsPath), iimport.mport.libraryName) : iimport.mport.libraryName;
      const lib = await import(libName);

      return [ klassName, lib[klassName] ];
    })
  );

  return imports.reduce( (accumulator, [key, value]) => {
      accumulator[key] = value;
      return accumulator;
    }, {});
}

async function bootstrap() {

  const imports = await getImports('./src2/for-component/example/example.component.ts');
  const providers = Object['values'](imports);

  @Module({
    imports: [],
    providers: providers,
    controllers: [],
    exports: []
  })
  class ApplicationModule {}

  const app = await NestFactory.createApplicationContext(ApplicationModule);
  console.log('>>>>>>>>> app >>>>>', app);
  // define import modules

  // application logic...
  // const myService = app.get(MyService);
  // const calendarService = app.get(OneviewCalendarService);
  // myService.myFunc();


  // const exampleComponent = new ExampleComponent(calendarService, 'fr');
  // console.log('calendar.weekdays', calendar.weekdays);
  // for (const key in calendar) {
  //   console.log('calendar key', key, calendar[key]);
  // }

  // console.log('................', calendar['calendar'].constructor.name);
  // console.log('................', calendar['language'].constructor.name);
}
bootstrap();
