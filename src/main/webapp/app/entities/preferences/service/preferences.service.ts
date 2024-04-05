import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, asapScheduler, scheduled } from 'rxjs';

import { catchError } from 'rxjs/operators';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Search } from 'app/core/request/request.model';
import { IPreferences, NewPreferences } from '../preferences.model';

export type PartialUpdatePreferences = Partial<IPreferences> & Pick<IPreferences, 'id'>;

export type EntityResponseType = HttpResponse<IPreferences>;
export type EntityArrayResponseType = HttpResponse<IPreferences[]>;

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/preferences');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/preferences/_search');

  create(preferences: NewPreferences): Observable<EntityResponseType> {
    return this.http.post<IPreferences>(this.resourceUrl, preferences, { observe: 'response' });
  }

  update(preferences: IPreferences): Observable<EntityResponseType> {
    return this.http.put<IPreferences>(`${this.resourceUrl}/${this.getPreferencesIdentifier(preferences)}`, preferences, {
      observe: 'response',
    });
  }

  partialUpdate(preferences: PartialUpdatePreferences): Observable<EntityResponseType> {
    return this.http.patch<IPreferences>(`${this.resourceUrl}/${this.getPreferencesIdentifier(preferences)}`, preferences, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPreferences>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPreferences[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: Search): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPreferences[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(catchError(() => scheduled([new HttpResponse<IPreferences[]>()], asapScheduler)));
  }

  user(): Observable<EntityResponseType> {
    return this.http.get<IPreferences>('api/preferences/user', { observe: 'response' });
  }

  getPreferencesIdentifier(preferences: Pick<IPreferences, 'id'>): number {
    return preferences.id;
  }

  comparePreferences(o1: Pick<IPreferences, 'id'> | null, o2: Pick<IPreferences, 'id'> | null): boolean {
    return o1 && o2 ? this.getPreferencesIdentifier(o1) === this.getPreferencesIdentifier(o2) : o1 === o2;
  }

  addPreferencesToCollectionIfMissing<Type extends Pick<IPreferences, 'id'>>(
    preferencesCollection: Type[],
    ...preferencesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const preferences: Type[] = preferencesToCheck.filter(isPresent);
    if (preferences.length > 0) {
      const preferencesCollectionIdentifiers = preferencesCollection.map(preferencesItem => this.getPreferencesIdentifier(preferencesItem));
      const preferencesToAdd = preferences.filter(preferencesItem => {
        const preferencesIdentifier = this.getPreferencesIdentifier(preferencesItem);
        if (preferencesCollectionIdentifiers.includes(preferencesIdentifier)) {
          return false;
        }
        preferencesCollectionIdentifiers.push(preferencesIdentifier);
        return true;
      });
      return [...preferencesToAdd, ...preferencesCollection];
    }
    return preferencesCollection;
  }
}
