import { Route } from '@angular/router';

import { HomeComponent } from './';
import { AboutComponent } from '../about/about.component';
import { HistoryComponent } from '../history/history.component';

export const HOME_ROUTE: Route = {
    path: '', component: HomeComponent,
    data: {
        authorities: [],
        pageTitle: 'home.title'
    }
};

export const ABOUT_ROUTE: Route = {
    path: 'about',
    component: AboutComponent,
    data: {
        authorities: [],
        pageTitle: 'global.menu.about'
    }
};

export const HISTORY_ROUTE: Route = {
    path: 'history',
    component: HistoryComponent,
    data: {
        authorities: [],
        pageTitle: 'global.menu.history'
    }
};
