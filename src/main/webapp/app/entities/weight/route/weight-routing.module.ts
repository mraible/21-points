import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { WeightComponent } from '../list/weight.component';
import { WeightDetailComponent } from '../detail/weight-detail.component';
import { WeightUpdateComponent } from '../update/weight-update.component';
import { WeightRoutingResolveService } from './weight-routing-resolve.service';

const weightRoute: Routes = [
  {
    path: '',
    component: WeightComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: WeightDetailComponent,
    resolve: {
      weight: WeightRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: WeightUpdateComponent,
    resolve: {
      weight: WeightRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: WeightUpdateComponent,
    resolve: {
      weight: WeightRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(weightRoute)],
  exports: [RouterModule],
})
export class WeightRoutingModule {}
