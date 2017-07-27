import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TwentyOnePointsSharedModule } from '../shared';

import { HOME_ROUTE, HomeComponent, ABOUT_ROUTE, AboutComponent } from './';

@NgModule({
    imports: [
        TwentyOnePointsSharedModule,
        RouterModule.forRoot([ HOME_ROUTE, ABOUT_ROUTE ], { useHash: true })
    ],
    declarations: [
        HomeComponent,
        AboutComponent
    ],
    entryComponents: [
    ],
    providers: [
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TwentyOnePointsHomeModule {}
