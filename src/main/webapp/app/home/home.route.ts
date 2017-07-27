import { Route } from '@angular/router';

import { UserRouteAccessService } from '../shared';
import { HomeComponent } from './';
import { AboutComponent } from './about.component';

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
