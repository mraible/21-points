import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PointsComponent } from '../list/points.component';
import { PointsDetailComponent } from '../detail/points-detail.component';
import { PointsUpdateComponent } from '../update/points-update.component';
import { PointsRoutingResolveService } from './points-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const pointsRoute: Routes = [
  {
    path: '',
    component: PointsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PointsDetailComponent,
    resolve: {
      points: PointsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PointsUpdateComponent,
    resolve: {
      points: PointsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PointsUpdateComponent,
    resolve: {
      points: PointsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(pointsRoute)],
  exports: [RouterModule],
})
export class PointsRoutingModule {}
