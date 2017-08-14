import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils } from 'ng-jhipster';

import { Weight } from './weight.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class WeightService {

    private resourceUrl = 'api/weights';
    private resourceSearchUrl = 'api/_search/weights';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(weight: Weight): Observable<Weight> {
        const copy = this.convert(weight);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    update(weight: Weight): Observable<Weight> {
        const copy = this.convert(weight);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    find(id: number): Observable<Weight> {
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

    last30Days(): Observable<Weight> {
        return this.http.get('api/weight-by-days/30').map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    byMonth(month: string): Observable<ResponseWrapper> {
        return this.http.get(`api/weight-by-month/${month}`)
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
        entity.timestamp = this.dateUtils
            .convertDateTimeFromServer(entity.timestamp);
    }

    private convert(weight: Weight): Weight {
        const copy: Weight = Object.assign({}, weight);

        copy.timestamp = this.dateUtils.toDate(weight.timestamp);
        return copy;
    }
}
