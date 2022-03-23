import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Search } from 'app/core/request/request.model';
import { IPreferences, getPreferencesIdentifier } from '../preferences.model';

export type EntityResponseType = HttpResponse<IPreferences>;
export type EntityArrayResponseType = HttpResponse<IPreferences[]>;

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/preferences');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/preferences');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(preferences: IPreferences): Observable<EntityResponseType> {
    return this.http.post<IPreferences>(this.resourceUrl, preferences, { observe: 'response' });
  }

  update(preferences: IPreferences): Observable<EntityResponseType> {
    return this.http.put<IPreferences>(`${this.resourceUrl}/${getPreferencesIdentifier(preferences) as number}`, preferences, {
      observe: 'response',
    });
  }

  partialUpdate(preferences: IPreferences): Observable<EntityResponseType> {
    return this.http.patch<IPreferences>(`${this.resourceUrl}/${getPreferencesIdentifier(preferences) as number}`, preferences, {
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
    return this.http.get<IPreferences[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }

  addPreferencesToCollectionIfMissing(
    preferencesCollection: IPreferences[],
    ...preferencesToCheck: (IPreferences | null | undefined)[]
  ): IPreferences[] {
    const preferences: IPreferences[] = preferencesToCheck.filter(isPresent);
    if (preferences.length > 0) {
      const preferencesCollectionIdentifiers = preferencesCollection.map(preferencesItem => getPreferencesIdentifier(preferencesItem)!);
      const preferencesToAdd = preferences.filter(preferencesItem => {
        const preferencesIdentifier = getPreferencesIdentifier(preferencesItem);
        if (preferencesIdentifier == null || preferencesCollectionIdentifiers.includes(preferencesIdentifier)) {
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
