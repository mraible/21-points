import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { PointsComponent } from './points.component';
import { PointsDetailComponent } from './points-detail.component';
import { PointsPopupComponent } from './points-dialog.component';
import { PointsDeletePopupComponent } from './points-delete-dialog.component';

import { Principal } from '../../shared';

export const pointsRoute: Routes = [
    {
        path: 'points',
        component: PointsComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.points.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'points/:id',
        component: PointsDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.points.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const pointsPopupRoute: Routes = [
    {
        path: 'points-new',
        component: PointsPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.points.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'points/:id/edit',
        component: PointsPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.points.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'points/:id/delete',
        component: PointsDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.points.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
