import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { PointsComponent } from './points.component';
import { PointsDetailComponent } from './points-detail.component';
import { PointsPopupComponent } from './points-dialog.component';
import { PointsDeletePopupComponent } from './points-delete-dialog.component';

@Injectable()
export class PointsResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
        const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
        return {
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort)
      };
    }
}

export const pointsRoute: Routes = [
    {
        path: 'points',
        component: PointsComponent,
        resolve: {
            'pagingParams': PointsResolvePagingParams
        },
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
