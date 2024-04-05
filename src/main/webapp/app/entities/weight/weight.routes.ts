import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { WeightComponent } from './list/weight.component';
import { WeightDetailComponent } from './detail/weight-detail.component';
import { WeightUpdateComponent } from './update/weight-update.component';
import WeightResolve from './route/weight-routing-resolve.service';

const weightRoute: Routes = [
  {
    path: '',
    component: WeightComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: WeightDetailComponent,
    resolve: {
      weight: WeightResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: WeightUpdateComponent,
    resolve: {
      weight: WeightResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: WeightUpdateComponent,
    resolve: {
      weight: WeightResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default weightRoute;
