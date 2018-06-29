import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Weight } from './weight.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Weight>;

@Injectable()
export class WeightService {

    private resourceUrl =  SERVER_API_URL + 'api/weights';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/weights';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(weight: Weight): Observable<EntityResponseType> {
        const copy = this.convert(weight);
        return this.http.post<Weight>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(weight: Weight): Observable<EntityResponseType> {
        const copy = this.convert(weight);
        return this.http.put<Weight>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Weight>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Weight[]>> {
        const options = createRequestOption(req);
        return this.http.get<Weight[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Weight[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<Weight[]>> {
        const options = createRequestOption(req);
        return this.http.get<Weight[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Weight[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Weight = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Weight[]>): HttpResponse<Weight[]> {
        const jsonResponse: Weight[] = res.body;
        const body: Weight[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Weight.
     */
    private convertItemFromServer(weight: Weight): Weight {
        const copy: Weight = Object.assign({}, weight);
        copy.timestamp = this.dateUtils
            .convertDateTimeFromServer(weight.timestamp);
        return copy;
    }

    /**
     * Convert a Weight to a JSON which can be sent to the server.
     */
    private convert(weight: Weight): Weight {
        const copy: Weight = Object.assign({}, weight);

        copy.timestamp = this.dateUtils.toDate(weight.timestamp);
        return copy;
    }
}
