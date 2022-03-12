import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPoints, Points } from '../points.model';
import { PointsService } from '../service/points.service';

@Injectable({ providedIn: 'root' })
export class PointsRoutingResolveService implements Resolve<IPoints> {
  constructor(protected service: PointsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPoints> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((points: HttpResponse<Points>) => {
          if (points.body) {
            return of(points.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Points());
  }
}
