import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Weight } from 'app/shared/model/weight.model';
import { WeightService } from './weight.service';
import { WeightComponent } from './weight.component';
import { WeightDetailComponent } from './weight-detail.component';
import { WeightUpdateComponent } from './weight-update.component';
import { WeightDeletePopupComponent } from './weight-delete-dialog.component';
import { IWeight } from 'app/shared/model/weight.model';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared';

@Injectable({ providedIn: 'root' })
export class WeightResolve implements Resolve<IWeight> {
    constructor(private service: WeightService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((weight: HttpResponse<Weight>) => weight.body));
        }
        // populate date/time with current time if new
        const w = new Weight();
        w.timestamp = moment(new Date(), DATE_TIME_FORMAT);
        return of(w);
    }
}

export const weightRoute: Routes = [
    {
        path: 'weight',
        component: WeightComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.weight.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'weight/:id/view',
        component: WeightDetailComponent,
        resolve: {
            weight: WeightResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.weight.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'weight/new',
        component: WeightUpdateComponent,
        resolve: {
            weight: WeightResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.weight.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'weight/:id/edit',
        component: WeightUpdateComponent,
        resolve: {
            weight: WeightResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.weight.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const weightPopupRoute: Routes = [
    {
        path: 'weight/:id/delete',
        component: WeightDeletePopupComponent,
        resolve: {
            weight: WeightResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'twentyOnePointsApp.weight.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
