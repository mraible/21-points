import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IWeight, Weight } from '../weight.model';
import { WeightService } from '../service/weight.service';

@Injectable({ providedIn: 'root' })
export class WeightRoutingResolveService implements Resolve<IWeight> {
  constructor(protected service: WeightService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IWeight> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((weight: HttpResponse<Weight>) => {
          if (weight.body) {
            return of(weight.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Weight());
  }
}
