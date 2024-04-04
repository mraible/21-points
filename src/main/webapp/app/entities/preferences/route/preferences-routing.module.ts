import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PreferencesComponent } from '../list/preferences.component';
import { PreferencesDetailComponent } from '../detail/preferences-detail.component';
import { PreferencesUpdateComponent } from '../update/preferences-update.component';
import { PreferencesRoutingResolveService } from './preferences-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

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
      preferences: PreferencesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PreferencesUpdateComponent,
    resolve: {
      preferences: PreferencesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PreferencesUpdateComponent,
    resolve: {
      preferences: PreferencesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(preferencesRoute)],
  exports: [RouterModule],
})
export class PreferencesRoutingModule {}
