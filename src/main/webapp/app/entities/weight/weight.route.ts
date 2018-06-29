import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { WeightComponent } from './weight.component';
import { WeightDetailComponent } from './weight-detail.component';
import { WeightPopupComponent } from './weight-dialog.component';
import { WeightDeletePopupComponent } from './weight-delete-dialog.component';

export const weightRoute: Routes = [
    {
        path: 'weight',
        component: WeightComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.weight.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'weight/:id',
        component: WeightDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.weight.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const weightPopupRoute: Routes = [
    {
        path: 'weight-new',
        component: WeightPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.weight.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'weight/:id/edit',
        component: WeightPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.weight.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'weight/:id/delete',
        component: WeightDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.weight.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
