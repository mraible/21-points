import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Points } from 'app/shared/model/points.model';
import { PointsService } from './points.service';
import { PointsComponent } from './points.component';
import { PointsDetailComponent } from './points-detail.component';
import { PointsUpdateComponent } from './points-update.component';
import { PointsDeletePopupComponent } from './points-delete-dialog.component';
import { IPoints } from 'app/shared/model/points.model';

@Injectable({ providedIn: 'root' })
export class PointsResolve implements Resolve<IPoints> {
    constructor(private service: PointsService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((points: HttpResponse<Points>) => points.body));
        }
        return of(new Points());
    }
}

export const pointsRoute: Routes = [
    {
        path: 'points',
        component: PointsComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'twentyOnePointsApp.points.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'points/:id/view',
        component: PointsDetailComponent,
        resolve: {
            points: PointsResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.points.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'points/new',
        component: PointsUpdateComponent,
        resolve: {
            points: PointsResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.points.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'points/:id/edit',
        component: PointsUpdateComponent,
        resolve: {
            points: PointsResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.points.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const pointsPopupRoute: Routes = [
    {
        path: 'points/:id/delete',
        component: PointsDeletePopupComponent,
        resolve: {
            points: PointsResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.points.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
