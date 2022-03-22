import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { WeightComponent } from './list/weight.component';
import { WeightDetailComponent } from './detail/weight-detail.component';
import { WeightUpdateComponent } from './update/weight-update.component';
import { WeightDeleteDialogComponent } from './delete/weight-delete-dialog.component';
import { WeightRoutingModule } from './route/weight-routing.module';

@NgModule({
  imports: [SharedModule, WeightRoutingModule],
  declarations: [WeightComponent, WeightDetailComponent, WeightUpdateComponent, WeightDeleteDialogComponent],
  entryComponents: [WeightDeleteDialogComponent],
})
export class WeightModule {}
