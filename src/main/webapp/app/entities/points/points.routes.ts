import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { PointsComponent } from './list/points.component';
import { PointsDetailComponent } from './detail/points-detail.component';
import { PointsUpdateComponent } from './update/points-update.component';
import PointsResolve from './route/points-routing-resolve.service';

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
      points: PointsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PointsUpdateComponent,
    resolve: {
      points: PointsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PointsUpdateComponent,
    resolve: {
      points: PointsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default pointsRoute;
