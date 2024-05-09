import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'twentyOnePointsApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'points',
    data: { pageTitle: 'twentyOnePointsApp.points.home.title' },
    loadChildren: () => import('./points/points.routes'),
  },
  {
    path: 'weight',
    data: { pageTitle: 'twentyOnePointsApp.weight.home.title' },
    loadChildren: () => import('./weight/weight.routes'),
  },
  {
    path: 'blood-pressure',
    data: { pageTitle: 'twentyOnePointsApp.bloodPressure.home.title' },
    loadChildren: () => import('./blood-pressure/blood-pressure.routes'),
  },
  {
    path: 'preferences',
    data: { pageTitle: 'twentyOnePointsApp.preferences.home.title' },
    loadChildren: () => import('./preferences/preferences.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
