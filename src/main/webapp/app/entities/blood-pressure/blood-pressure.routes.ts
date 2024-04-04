import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { BloodPressureComponent } from './list/blood-pressure.component';
import { BloodPressureDetailComponent } from './detail/blood-pressure-detail.component';
import { BloodPressureUpdateComponent } from './update/blood-pressure-update.component';
import BloodPressureResolve from './route/blood-pressure-routing-resolve.service';

const bloodPressureRoute: Routes = [
  {
    path: '',
    component: BloodPressureComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BloodPressureDetailComponent,
    resolve: {
      bloodPressure: BloodPressureResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BloodPressureUpdateComponent,
    resolve: {
      bloodPressure: BloodPressureResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BloodPressureUpdateComponent,
    resolve: {
      bloodPressure: BloodPressureResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default bloodPressureRoute;
