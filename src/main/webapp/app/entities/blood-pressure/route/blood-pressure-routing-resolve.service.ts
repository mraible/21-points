import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBloodPressure } from '../blood-pressure.model';
import { BloodPressureService } from '../service/blood-pressure.service';

@Injectable({ providedIn: 'root' })
export class BloodPressureRoutingResolveService implements Resolve<IBloodPressure | null> {
  constructor(protected service: BloodPressureService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBloodPressure | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((bloodPressure: HttpResponse<IBloodPressure>) => {
          if (bloodPressure.body) {
            return of(bloodPressure.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
