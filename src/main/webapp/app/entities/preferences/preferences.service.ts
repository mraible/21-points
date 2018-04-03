import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Preferences } from './preferences.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Preferences>;

@Injectable()
export class PreferencesService {

    private resourceUrl =  SERVER_API_URL + 'api/preferences';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/preferences';

    constructor(private http: HttpClient) { }

    create(preferences: Preferences): Observable<EntityResponseType> {
        const copy = this.convert(preferences);
        return this.http.post<Preferences>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(preferences: Preferences): Observable<EntityResponseType> {
        const copy = this.convert(preferences);
        return this.http.put<Preferences>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Preferences>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Preferences[]>> {
        const options = createRequestOption(req);
        return this.http.get<Preferences[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Preferences[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<Preferences[]>> {
        const options = createRequestOption(req);
        return this.http.get<Preferences[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Preferences[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Preferences = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Preferences[]>): HttpResponse<Preferences[]> {
        const jsonResponse: Preferences[] = res.body;
        const body: Preferences[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Preferences.
     */
    private convertItemFromServer(preferences: Preferences): Preferences {
        const copy: Preferences = Object.assign({}, preferences);
        return copy;
    }

    /**
     * Convert a Preferences to a JSON which can be sent to the server.
     */
    private convert(preferences: Preferences): Preferences {
        const copy: Preferences = Object.assign({}, preferences);
        return copy;
    }
}
