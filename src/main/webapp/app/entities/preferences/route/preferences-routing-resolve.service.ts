import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPreferences } from '../preferences.model';
import { PreferencesService } from '../service/preferences.service';

const preferencesResolve = (route: ActivatedRouteSnapshot): Observable<null | IPreferences> => {
  const id = route.params['id'];
  if (id) {
    return inject(PreferencesService)
      .find(id)
      .pipe(
        mergeMap((preferences: HttpResponse<IPreferences>) => {
          if (preferences.body) {
            return of(preferences.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default preferencesResolve;
