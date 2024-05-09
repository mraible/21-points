import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IWeight } from '../weight.model';
import { WeightService } from '../service/weight.service';

const weightResolve = (route: ActivatedRouteSnapshot): Observable<null | IWeight> => {
  const id = route.params['id'];
  if (id) {
    return inject(WeightService)
      .find(id)
      .pipe(
        mergeMap((weight: HttpResponse<IWeight>) => {
          if (weight.body) {
            return of(weight.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default weightResolve;
