import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TwentyOnePointsSharedModule } from '../../shared';
import { TwentyOnePointsAdminModule } from '../../admin/admin.module';
import {
    BloodPressureService,
    BloodPressurePopupService,
    BloodPressureComponent,
    BloodPressureDetailComponent,
    BloodPressureDialogComponent,
    BloodPressurePopupComponent,
    BloodPressureDeletePopupComponent,
    BloodPressureDeleteDialogComponent,
    bloodPressureRoute,
    bloodPressurePopupRoute,
} from './';

const ENTITY_STATES = [
    ...bloodPressureRoute,
    ...bloodPressurePopupRoute,
];

@NgModule({
    imports: [
        TwentyOnePointsSharedModule,
        TwentyOnePointsAdminModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        BloodPressureComponent,
        BloodPressureDetailComponent,
        BloodPressureDialogComponent,
        BloodPressureDeleteDialogComponent,
        BloodPressurePopupComponent,
        BloodPressureDeletePopupComponent,
    ],
    entryComponents: [
        BloodPressureComponent,
        BloodPressureDialogComponent,
        BloodPressurePopupComponent,
        BloodPressureDeleteDialogComponent,
        BloodPressureDeletePopupComponent,
    ],
    providers: [
        BloodPressureService,
        BloodPressurePopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TwentyOnePointsBloodPressureModule {}
