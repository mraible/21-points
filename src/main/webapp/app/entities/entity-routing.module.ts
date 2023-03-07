import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'points',
        data: { pageTitle: 'twentyOnePointsApp.points.home.title' },
        loadChildren: () => import('./points/points.module').then(m => m.PointsModule),
      },
      {
        path: 'weight',
        data: { pageTitle: 'twentyOnePointsApp.weight.home.title' },
        loadChildren: () => import('./weight/weight.module').then(m => m.WeightModule),
      },
      {
        path: 'blood-pressure',
        data: { pageTitle: 'twentyOnePointsApp.bloodPressure.home.title' },
        loadChildren: () => import('./blood-pressure/blood-pressure.module').then(m => m.BloodPressureModule),
      },
      {
        path: 'preferences',
        data: { pageTitle: 'twentyOnePointsApp.preferences.home.title' },
        loadChildren: () => import('./preferences/preferences.module').then(m => m.PreferencesModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
