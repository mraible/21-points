import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { ABOUT_ROUTE, HISTORY_ROUTE, HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { NgChartsModule } from 'ng2-charts';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AboutComponent } from '../about/about.component';
import { HistoryComponent } from '../history/history.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    SharedModule,
    NgChartsModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    RouterModule.forChild([HOME_ROUTE, ABOUT_ROUTE, HISTORY_ROUTE]),
  ],
  declarations: [HomeComponent, AboutComponent, HistoryComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeModule {}
