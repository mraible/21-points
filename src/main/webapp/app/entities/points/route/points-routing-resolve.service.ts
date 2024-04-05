import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPoints } from '../points.model';
import { PointsService } from '../service/points.service';

const pointsResolve = (route: ActivatedRouteSnapshot): Observable<null | IPoints> => {
  const id = route.params['id'];
  if (id) {
    return inject(PointsService)
      .find(id)
      .pipe(
        mergeMap((points: HttpResponse<IPoints>) => {
          if (points.body) {
            return of(points.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default pointsResolve;
