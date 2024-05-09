import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBloodPressure } from '../blood-pressure.model';
import { BloodPressureService } from '../service/blood-pressure.service';

const bloodPressureResolve = (route: ActivatedRouteSnapshot): Observable<null | IBloodPressure> => {
  const id = route.params['id'];
  if (id) {
    return inject(BloodPressureService)
      .find(id)
      .pipe(
        mergeMap((bloodPressure: HttpResponse<IBloodPressure>) => {
          if (bloodPressure.body) {
            return of(bloodPressure.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default bloodPressureResolve;
