import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BloodPressureComponent } from './list/blood-pressure.component';
import { BloodPressureDetailComponent } from './detail/blood-pressure-detail.component';
import { BloodPressureUpdateComponent } from './update/blood-pressure-update.component';
import { BloodPressureDeleteDialogComponent } from './delete/blood-pressure-delete-dialog.component';
import { BloodPressureRoutingModule } from './route/blood-pressure-routing.module';

@NgModule({
  imports: [SharedModule, BloodPressureRoutingModule],
  declarations: [BloodPressureComponent, BloodPressureDetailComponent, BloodPressureUpdateComponent, BloodPressureDeleteDialogComponent],
})
export class BloodPressureModule {}
