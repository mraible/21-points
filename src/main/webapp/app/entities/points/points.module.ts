import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PointsComponent } from './list/points.component';
import { PointsDetailComponent } from './detail/points-detail.component';
import { PointsUpdateComponent } from './update/points-update.component';
import { PointsDeleteDialogComponent } from './delete/points-delete-dialog.component';
import { PointsRoutingModule } from './route/points-routing.module';

@NgModule({
  imports: [SharedModule, PointsRoutingModule],
  declarations: [PointsComponent, PointsDetailComponent, PointsUpdateComponent, PointsDeleteDialogComponent],
})
export class PointsModule {}
