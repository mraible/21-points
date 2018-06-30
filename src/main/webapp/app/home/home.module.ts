import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TwentyOnePointsSharedModule } from 'app/shared';
import { HOME_ROUTE, HomeComponent, ABOUT_ROUTE, HISTORY_ROUTE } from './';
import { NvD3Module } from 'ng2-nvd3';
import 'd3';
import 'nvd3';
import { CalendarModule } from 'angular-calendar';
import { AboutComponent } from '../about/about.component';
import { HistoryComponent } from '../history/history.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    imports: [
        TwentyOnePointsSharedModule,
        NvD3Module,
        BrowserAnimationsModule,
        CalendarModule.forRoot(),
        RouterModule.forChild([HOME_ROUTE, ABOUT_ROUTE, HISTORY_ROUTE])
    ],
    declarations: [HomeComponent, AboutComponent, HistoryComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TwentyOnePointsHomeModule {}
