import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TwentyOnePointsSharedModule } from '../../shared';
import { TwentyOnePointsAdminModule } from '../../admin/admin.module';
import {
    WeightService,
    WeightPopupService,
    WeightComponent,
    WeightDetailComponent,
    WeightDialogComponent,
    WeightPopupComponent,
    WeightDeletePopupComponent,
    WeightDeleteDialogComponent,
    weightRoute,
    weightPopupRoute,
} from './';

const ENTITY_STATES = [
    ...weightRoute,
    ...weightPopupRoute,
];

@NgModule({
    imports: [
        TwentyOnePointsSharedModule,
        TwentyOnePointsAdminModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        WeightComponent,
        WeightDetailComponent,
        WeightDialogComponent,
        WeightDeleteDialogComponent,
        WeightPopupComponent,
        WeightDeletePopupComponent,
    ],
    entryComponents: [
        WeightComponent,
        WeightDialogComponent,
        WeightPopupComponent,
        WeightDeleteDialogComponent,
        WeightDeletePopupComponent,
    ],
    providers: [
        WeightService,
        WeightPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TwentyOnePointsWeightModule {}
