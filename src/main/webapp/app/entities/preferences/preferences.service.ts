import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IPreferences } from 'app/shared/model/preferences.model';

type EntityResponseType = HttpResponse<IPreferences>;
type EntityArrayResponseType = HttpResponse<IPreferences[]>;

@Injectable({ providedIn: 'root' })
export class PreferencesService {
    private resourceUrl = SERVER_API_URL + 'api/preferences';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/preferences';

    constructor(private http: HttpClient) {}

    create(preferences: IPreferences): Observable<EntityResponseType> {
        return this.http.post<IPreferences>(this.resourceUrl, preferences, { observe: 'response' });
    }

    update(preferences: IPreferences): Observable<EntityResponseType> {
        return this.http.put<IPreferences>(this.resourceUrl, preferences, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IPreferences>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IPreferences[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IPreferences[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }

    user(): Observable<EntityResponseType> {
        return this.http.get<IPreferences>('api/my-preferences', { observe: 'response' });
    }
}
