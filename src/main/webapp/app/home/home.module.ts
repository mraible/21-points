import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TwentyOnePointsSharedModule } from '../shared';

import { HOME_ROUTE, HomeComponent, ABOUT_ROUTE, AboutComponent } from './';
import { NvD3Component } from 'ng2-nvd3';
import 'd3';
import 'nvd3';

@NgModule({
    imports: [
        TwentyOnePointsSharedModule,
        RouterModule.forRoot([ HOME_ROUTE, ABOUT_ROUTE ], { useHash: true })
    ],
    declarations: [
        HomeComponent,
        AboutComponent,
        NvD3Component
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TwentyOnePointsHomeModule {}
