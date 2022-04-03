import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BloodPressureComponent } from '../list/blood-pressure.component';
import { BloodPressureDetailComponent } from '../detail/blood-pressure-detail.component';
import { BloodPressureUpdateComponent } from '../update/blood-pressure-update.component';
import { BloodPressureRoutingResolveService } from './blood-pressure-routing-resolve.service';

const bloodPressureRoute: Routes = [
  {
    path: '',
    component: BloodPressureComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BloodPressureDetailComponent,
    resolve: {
      bloodPressure: BloodPressureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BloodPressureUpdateComponent,
    resolve: {
      bloodPressure: BloodPressureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BloodPressureUpdateComponent,
    resolve: {
      bloodPressure: BloodPressureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(bloodPressureRoute)],
  exports: [RouterModule],
})
export class BloodPressureRoutingModule {}
