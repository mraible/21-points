import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { BloodPressure } from './blood-pressure.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<BloodPressure>;

@Injectable()
export class BloodPressureService {

    private resourceUrl =  SERVER_API_URL + 'api/blood-pressures';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/blood-pressures';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(bloodPressure: BloodPressure): Observable<EntityResponseType> {
        const copy = this.convert(bloodPressure);
        return this.http.post<BloodPressure>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(bloodPressure: BloodPressure): Observable<EntityResponseType> {
        const copy = this.convert(bloodPressure);
        return this.http.put<BloodPressure>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<BloodPressure>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<BloodPressure[]>> {
        const options = createRequestOption(req);
        return this.http.get<BloodPressure[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<BloodPressure[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<BloodPressure[]>> {
        const options = createRequestOption(req);
        return this.http.get<BloodPressure[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<BloodPressure[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: BloodPressure = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<BloodPressure[]>): HttpResponse<BloodPressure[]> {
        const jsonResponse: BloodPressure[] = res.body;
        const body: BloodPressure[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to BloodPressure.
     */
    private convertItemFromServer(bloodPressure: BloodPressure): BloodPressure {
        const copy: BloodPressure = Object.assign({}, bloodPressure);
        copy.timestamp = this.dateUtils
            .convertDateTimeFromServer(bloodPressure.timestamp);
        return copy;
    }

    /**
     * Convert a BloodPressure to a JSON which can be sent to the server.
     */
    private convert(bloodPressure: BloodPressure): BloodPressure {
        const copy: BloodPressure = Object.assign({}, bloodPressure);

        copy.timestamp = this.dateUtils.toDate(bloodPressure.timestamp);
        return copy;
    }
}
