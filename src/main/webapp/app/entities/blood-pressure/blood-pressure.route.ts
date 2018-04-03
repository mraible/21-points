import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { BloodPressureComponent } from './blood-pressure.component';
import { BloodPressureDetailComponent } from './blood-pressure-detail.component';
import { BloodPressurePopupComponent } from './blood-pressure-dialog.component';
import { BloodPressureDeletePopupComponent } from './blood-pressure-delete-dialog.component';

export const bloodPressureRoute: Routes = [
    {
        path: 'blood-pressure',
        component: BloodPressureComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.bloodPressure.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'blood-pressure/:id',
        component: BloodPressureDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.bloodPressure.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const bloodPressurePopupRoute: Routes = [
    {
        path: 'blood-pressure-new',
        component: BloodPressurePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.bloodPressure.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'blood-pressure/:id/edit',
        component: BloodPressurePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.bloodPressure.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'blood-pressure/:id/delete',
        component: BloodPressureDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.bloodPressure.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
