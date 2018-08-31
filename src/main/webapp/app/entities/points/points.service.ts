import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IPoints } from 'app/shared/model/points.model';

type EntityResponseType = HttpResponse<IPoints>;
type EntityArrayResponseType = HttpResponse<IPoints[]>;

@Injectable({ providedIn: 'root' })
export class PointsService {
    private resourceUrl = SERVER_API_URL + 'api/points';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/points';

    constructor(private http: HttpClient) {}

    create(points: IPoints): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(points);
        return this.http
            .post<IPoints>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(points: IPoints): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(points);
        return this.http
            .put<IPoints>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IPoints>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IPoints[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IPoints[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    thisWeek(): Observable<EntityResponseType> {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return this.http
            .get(`api/points-this-week?tz=${tz}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    byWeek(date: string): Observable<EntityResponseType> {
        return this.http
            .get(`api/points-by-week/${date}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    byMonth(month: string): Observable<EntityResponseType> {
        return this.http
            .get(`api/points-by-month/${month}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    private convertDateFromClient(points: IPoints): IPoints {
        const copy: IPoints = Object.assign({}, points, {
            date: points.date != null && points.date.isValid() ? points.date.format(DATE_FORMAT) : null
        });
        return copy;
    }

    private convertDateFromServer(res: EntityResponseType): EntityResponseType {
        res.body.date = res.body.date != null ? moment(res.body.date) : null;
        return res;
    }

    private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        res.body.forEach((points: IPoints) => {
            points.date = points.date != null ? moment(points.date) : null;
        });
        return res;
    }
}
