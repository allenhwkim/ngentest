import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import { DynamicModule, Injectable, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { NgTestWriter } from './ng-test-writer';

// async function getImports(ejsData, tsPath) {
//   const imports = await Promise.all(
//     Object.keys(ejsData.providers).map( async function(klassName) {
//       const provider = ejsData.providers[klassName];
//       const iimport = ejsData.parsedImports[klassName];
//       const libName = iimport.mport.libraryName.match(/^\./) ? // if userPath, recalculate path
//         path.join(path.dirname(tsPath), iimport.mport.libraryName) : iimport.mport.libraryName;
//       const lib = await import(libName);

//       return [ klassName, lib[klassName], libName ];
//     })
//   );

//   return imports;
//   // return imports.reduce( (accumulator, [key, value]) => {
//   //     accumulator[key] = value;
//   //     return accumulator;
//   //   }, {});
// }

// async function bootstrap() {
//   const tsParamPath = './src2/for-component/example/example.component.ts';
//   const tsPath = path.resolve(tsParamPath);
//   const testWriter = new NgTestWriter(tsPath);
//   const testGenerator: any = testWriter.getTestGenerator(); // get test generator. e.g. ComponentData
//   const ejsData = await testGenerator.getEjsData(); // parse typescript

//   // const imports = await getImports(ejsData, tsPath);
//   // console.log('>>>>>>>> imports', imports);

//   // @Module({})
//   // class ApplicationModule {}
//   // const app = await NestFactory.createApplicationContext(ApplicationModule);

//   // console.log('>>>>>>>>> app >>>>>', app);
//   // define import modules

//   // application logic...
//   // const myService = app.get(MyService);
//   // const calendarService = app.get(OneviewCalendarService);
//   // myService.myFunc();


//   // const exampleComponent = new ExampleComponent(calendarService, 'fr');
//   // console.log('calendar.weekdays', calendar.weekdays);
//   // for (const key in calendar) {
//   //   console.log('calendar key', key, calendar[key]);
//   // }

//   // console.log('................', calendar['calendar'].constructor.name);
//   // console.log('................', calendar['language'].constructor.name);
// }
// bootstrap();
// function getKlass(name, props, params) {
//   const klasses = {[name]: class {}};
//   const klass = klasses[name];
//   Object.defineProperty(klass, 'name', {value: name});

//   props.forEach(prop => {
//     klass.prototype[prop.name] = undefined;
//   });

//   console.log('klass.....', klass);
//   return klass;
// }

async function run(tsParamPath) {
  const tsPath = path.resolve(tsParamPath);
  const testWriter = new NgTestWriter(tsPath);
  const testGenerator: any = testWriter.getTestGenerator(); // get test generator. e.g. ComponentData
  const ejsData = await testGenerator.getEjsData(); // parse typescript

  const source = testGenerator.typescript;
  // console.log('>>>>>>>>>>>>> source', source);

  const result = ts.transpileModule(source, {
    compilerOptions : {
      module: ts.ModuleKind.CommonJS, experimentalDecorators: true, target: ts.ScriptTarget.ES2015
      //module: ts.ModuleKind.ES2015, experimentalDecorators: true, target: ts.ScriptTarget.ES5
    }
  });
  console.log('>>>>>>>>>>>>> result', result.outputText);

  const res = fs.writeFileSync('tmp.js', '' + result.outputText);

  // function requireFromString(src) {
  //   var filename = path.resolve('tmp.js');
  //   var Module: any = module.constructor;
  //   var m = new Module(filename, __dirname);
  //   m._compile(src, filename);
  //   return m.exports;
  // }

  // console.log('>>>>>>>>>>>>>>>>......', requireFromString(result.outputText));
  const module = await import(path.resolve('tmp.js'));
  const Klass = module[ejsData.className];
  console.log('module....... 1', Klass);
  console.log('module....... 2', ''+Klass.constructor);
  console.log('module....... 3', new Klass());
  // console.log('module....... ', klass);

  // const tmpPath = 
  // const x = eval(result.outputText);
  // console.log(';>>>>>>>>>>>>>>>>>>>> x >>>.', x);
  // const program = ts.createProgram([tsPath], {module: ts.ModuleKind.CommonJS, experimentalDecorators: true});
  // console.log('>>>>>>>>> program >>>>', program.emit());
  //   })

  // compile typescript
  // tsc --target es2015 --module commonjs --experimentalDecorators true --outDir foo src2/for-component/example/example.component.ts 
}


run('./src2/for-component/example/example.component.ts');

