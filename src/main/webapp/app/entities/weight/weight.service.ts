import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IWeight } from 'app/shared/model/weight.model';

type EntityResponseType = HttpResponse<IWeight>;
type EntityArrayResponseType = HttpResponse<IWeight[]>;

@Injectable({ providedIn: 'root' })
export class WeightService {
    private resourceUrl = SERVER_API_URL + 'api/weights';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/weights';

    constructor(private http: HttpClient) {}

    create(weight: IWeight): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(weight);
        return this.http
            .post<IWeight>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(weight: IWeight): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(weight);
        return this.http
            .put<IWeight>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IWeight>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IWeight[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IWeight[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    last30Days(): Observable<EntityResponseType> {
        return this.http
            .get('api/weight-by-days/30', { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    byMonth(month: string): Observable<EntityResponseType> {
        return this.http
            .get(`api/weight-by-month/${month}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    private convertDateFromClient(weight: IWeight): IWeight {
        const copy: IWeight = Object.assign({}, weight, {
            timestamp: weight.timestamp != null && weight.timestamp.isValid() ? weight.timestamp.toJSON() : null
        });
        return copy;
    }

    private convertDateFromServer(res: EntityResponseType): EntityResponseType {
        res.body.timestamp = res.body.timestamp != null ? moment(res.body.timestamp) : null;
        return res;
    }

    private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        res.body.forEach((weight: IWeight) => {
            weight.timestamp = weight.timestamp != null ? moment(weight.timestamp) : null;
        });
        return res;
    }
}
