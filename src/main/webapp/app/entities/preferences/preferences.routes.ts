import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { PreferencesComponent } from './list/preferences.component';
import { PreferencesDetailComponent } from './detail/preferences-detail.component';
import { PreferencesUpdateComponent } from './update/preferences-update.component';
import PreferencesResolve from './route/preferences-routing-resolve.service';

const preferencesRoute: Routes = [
  {
    path: '',
    component: PreferencesComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PreferencesDetailComponent,
    resolve: {
      preferences: PreferencesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PreferencesUpdateComponent,
    resolve: {
      preferences: PreferencesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PreferencesUpdateComponent,
    resolve: {
      preferences: PreferencesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default preferencesRoute;
