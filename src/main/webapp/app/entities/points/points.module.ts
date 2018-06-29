import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TwentyOnePointsSharedModule } from 'app/shared';
import { TwentyOnePointsAdminModule } from 'app/admin/admin.module';
import {
    PointsComponent,
    PointsDetailComponent,
    PointsUpdateComponent,
    PointsDeletePopupComponent,
    PointsDeleteDialogComponent,
    pointsRoute,
    pointsPopupRoute
} from './';

const ENTITY_STATES = [...pointsRoute, ...pointsPopupRoute];

@NgModule({
    imports: [TwentyOnePointsSharedModule, TwentyOnePointsAdminModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [PointsComponent, PointsDetailComponent, PointsUpdateComponent, PointsDeleteDialogComponent, PointsDeletePopupComponent],
    entryComponents: [PointsComponent, PointsUpdateComponent, PointsDeleteDialogComponent, PointsDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TwentyOnePointsPointsModule {}
