import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Points } from './points.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Points>;

@Injectable()
export class PointsService {

    private resourceUrl =  SERVER_API_URL + 'api/points';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/points';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(points: Points): Observable<EntityResponseType> {
        const copy = this.convert(points);
        return this.http.post<Points>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(points: Points): Observable<EntityResponseType> {
        const copy = this.convert(points);
        return this.http.put<Points>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Points>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Points[]>> {
        const options = createRequestOption(req);
        return this.http.get<Points[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Points[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<Points[]>> {
        const options = createRequestOption(req);
        return this.http.get<Points[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Points[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Points = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Points[]>): HttpResponse<Points[]> {
        const jsonResponse: Points[] = res.body;
        const body: Points[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Points.
     */
    private convertItemFromServer(points: Points): Points {
        const copy: Points = Object.assign({}, points);
        copy.date = this.dateUtils
            .convertLocalDateFromServer(points.date);
        return copy;
    }

    /**
     * Convert a Points to a JSON which can be sent to the server.
     */
    private convert(points: Points): Points {
        const copy: Points = Object.assign({}, points);
        copy.date = this.dateUtils
            .convertLocalDateToServer(points.date);
        return copy;
    }
}
