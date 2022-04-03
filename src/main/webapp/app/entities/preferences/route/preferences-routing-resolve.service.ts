import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPreferences, Preferences } from '../preferences.model';
import { PreferencesService } from '../service/preferences.service';

@Injectable({ providedIn: 'root' })
export class PreferencesRoutingResolveService implements Resolve<IPreferences> {
  constructor(protected service: PreferencesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPreferences> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((preferences: HttpResponse<Preferences>) => {
          if (preferences.body) {
            return of(preferences.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Preferences());
  }
}
