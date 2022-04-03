import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IBloodPressure, getBloodPressureIdentifier } from '../blood-pressure.model';

export type EntityResponseType = HttpResponse<IBloodPressure>;
export type EntityArrayResponseType = HttpResponse<IBloodPressure[]>;

@Injectable({ providedIn: 'root' })
export class BloodPressureService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/blood-pressures');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/blood-pressures');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(bloodPressure: IBloodPressure): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bloodPressure);
    return this.http
      .post<IBloodPressure>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(bloodPressure: IBloodPressure): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bloodPressure);
    return this.http
      .put<IBloodPressure>(`${this.resourceUrl}/${getBloodPressureIdentifier(bloodPressure) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(bloodPressure: IBloodPressure): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bloodPressure);
    return this.http
      .patch<IBloodPressure>(`${this.resourceUrl}/${getBloodPressureIdentifier(bloodPressure) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IBloodPressure>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IBloodPressure[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IBloodPressure[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  addBloodPressureToCollectionIfMissing(
    bloodPressureCollection: IBloodPressure[],
    ...bloodPressuresToCheck: (IBloodPressure | null | undefined)[]
  ): IBloodPressure[] {
    const bloodPressures: IBloodPressure[] = bloodPressuresToCheck.filter(isPresent);
    if (bloodPressures.length > 0) {
      const bloodPressureCollectionIdentifiers = bloodPressureCollection.map(
        bloodPressureItem => getBloodPressureIdentifier(bloodPressureItem)!
      );
      const bloodPressuresToAdd = bloodPressures.filter(bloodPressureItem => {
        const bloodPressureIdentifier = getBloodPressureIdentifier(bloodPressureItem);
        if (bloodPressureIdentifier == null || bloodPressureCollectionIdentifiers.includes(bloodPressureIdentifier)) {
          return false;
        }
        bloodPressureCollectionIdentifiers.push(bloodPressureIdentifier);
        return true;
      });
      return [...bloodPressuresToAdd, ...bloodPressureCollection];
    }
    return bloodPressureCollection;
  }

  protected convertDateFromClient(bloodPressure: IBloodPressure): IBloodPressure {
    return Object.assign({}, bloodPressure, {
      timestamp: bloodPressure.timestamp?.isValid() ? bloodPressure.timestamp.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.timestamp = res.body.timestamp ? dayjs(res.body.timestamp) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((bloodPressure: IBloodPressure) => {
        bloodPressure.timestamp = bloodPressure.timestamp ? dayjs(bloodPressure.timestamp) : undefined;
      });
    }
    return res;
  }
}
