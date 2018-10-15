import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiResolvePagingParams } from 'ng-jhipster';
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
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class PointsResolve implements Resolve<IPoints> {
    constructor(private service: PointsService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((points: HttpResponse<Points>) => points.body));
        } else {
            const points = new Points();
            // populate date with current date if date not passed in
            const date = route.queryParams['date'];
            if (date) {
                points.date = moment(date);
            } else {
                points.date = moment();
            }
            // default to the best day possible
            points.exercise = 1;
            points.meals = 1;
            points.alcohol = 1;
            return of(points);
        }
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
