import { Injectable, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { OneviewCalendarComponent } from './src/oneview-common/oneview-calendar/oneview-calendar.component';
import { OneviewCalendarService } from './src/oneview-common/oneview-calendar/oneview-calendar.service';

@Injectable()
class MyService {
  myFunc() {
    console.log('MyService.myFunc().......');
  }
}

@Module({
  imports: [],
  providers: [MyService, OneviewCalendarService],
  controllers: [],
  exports: []
})
export class ApplicationModule{}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(ApplicationModule);
  // application logic...
  const myService = app.get(MyService);
  const calendarService = app.get(OneviewCalendarService);
  myService.myFunc();

  const calendar = new OneviewCalendarComponent(calendarService, 'fr');
  console.log('calendar.weekdays', calendar.weekdays);
  // for (const key in calendar) {
  //   console.log('calendar key', key, calendar[key]);
  // }
  console.log('................', calendar['calendar'].constructor.name);
  console.log('................', calendar['language'].constructor.name);
}
bootstrap();
