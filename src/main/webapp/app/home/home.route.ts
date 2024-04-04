import { Route } from '@angular/router';

import { HomeComponent } from './home.component';
import { AboutComponent } from '../about/about.component';
import { HistoryComponent } from '../history/history.component';

export const HOME_ROUTE: Route = {
  path: '',
  component: HomeComponent,
  data: {
    pageTitle: 'home.title',
  },
};

export const ABOUT_ROUTE: Route = {
  path: 'about',
  component: AboutComponent,
  data: {
    pageTitle: 'global.menu.about',
  },
};

export const HISTORY_ROUTE: Route = {
  path: 'history',
  component: HistoryComponent,
  data: {
    pageTitle: 'global.menu.history',
  },
};
