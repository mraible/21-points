import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils } from 'ng-jhipster';

import { BloodPressure } from './blood-pressure.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class BloodPressureService {

    private resourceUrl = 'api/blood-pressures';
    private resourceSearchUrl = 'api/_search/blood-pressures';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(bloodPressure: BloodPressure): Observable<BloodPressure> {
        const copy = this.convert(bloodPressure);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    update(bloodPressure: BloodPressure): Observable<BloodPressure> {
        const copy = this.convert(bloodPressure);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    find(id: number): Observable<BloodPressure> {
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

    last30Days(): Observable<BloodPressure> {
        return this.http.get('api/bp-by-days/30').map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    byMonth(month: string): Observable<ResponseWrapper> {
        return this.http.get(`api/bp-by-month/${month}`)
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

    private convert(bloodPressure: BloodPressure): BloodPressure {
        const copy: BloodPressure = Object.assign({}, bloodPressure);

        copy.timestamp = this.dateUtils.toDate(bloodPressure.timestamp);
        return copy;
    }
}
