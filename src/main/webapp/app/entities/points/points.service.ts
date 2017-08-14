import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils } from 'ng-jhipster';

import { Points } from './points.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class PointsService {

    private resourceUrl = 'api/points';
    private resourceSearchUrl = 'api/_search/points';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(points: Points): Observable<Points> {
        const copy = this.convert(points);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    update(points: Points): Observable<Points> {
        const copy = this.convert(points);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    find(id: number): Observable<Points> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceSearchUrl, options)
            .map((res: any) => this.convertResponse(res));
    }

    thisWeek(): Observable<ResponseWrapper> {
        return this.http.get('api/points-this-week')
            .map((res: any) => this.convertResponse(res));
    }

    byMonth(month: string): Observable<ResponseWrapper> {
        return this.http.get(`api/points-by-month/${month}`)
            .map((res: any) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        for (let i = 0; i < jsonResponse.length; i++) {
            this.convertItemFromServer(jsonResponse[i]);
        }
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convertItemFromServer(entity: any) {
        entity.date = this.dateUtils
            .convertLocalDateFromServer(entity.date);
    }

    private convert(points: Points): Points {
        const copy: Points = Object.assign({}, points);
        copy.date = this.dateUtils
            .convertLocalDateToServer(points.date);
        return copy;
    }
}
