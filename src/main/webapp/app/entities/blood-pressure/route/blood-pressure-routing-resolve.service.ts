import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBloodPressure, BloodPressure } from '../blood-pressure.model';
import { BloodPressureService } from '../service/blood-pressure.service';

@Injectable({ providedIn: 'root' })
export class BloodPressureRoutingResolveService implements Resolve<IBloodPressure> {
  constructor(protected service: BloodPressureService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBloodPressure> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((bloodPressure: HttpResponse<BloodPressure>) => {
          if (bloodPressure.body) {
            return of(bloodPressure.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new BloodPressure());
  }
}
