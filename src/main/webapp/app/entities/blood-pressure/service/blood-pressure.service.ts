import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IBloodPressure, NewBloodPressure } from '../blood-pressure.model';

export type PartialUpdateBloodPressure = Partial<IBloodPressure> & Pick<IBloodPressure, 'id'>;

type RestOf<T extends IBloodPressure | NewBloodPressure> = Omit<T, 'timestamp'> & {
  timestamp?: string | null;
};

export type RestBloodPressure = RestOf<IBloodPressure>;

export type NewRestBloodPressure = RestOf<NewBloodPressure>;

export type PartialUpdateRestBloodPressure = RestOf<PartialUpdateBloodPressure>;

export type EntityResponseType = HttpResponse<IBloodPressure>;
export type EntityArrayResponseType = HttpResponse<IBloodPressure[]>;

@Injectable({ providedIn: 'root' })
export class BloodPressureService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/blood-pressures');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/blood-pressures');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(bloodPressure: NewBloodPressure): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bloodPressure);
    return this.http
      .post<RestBloodPressure>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(bloodPressure: IBloodPressure): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bloodPressure);
    return this.http
      .put<RestBloodPressure>(`${this.resourceUrl}/${this.getBloodPressureIdentifier(bloodPressure)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(bloodPressure: PartialUpdateBloodPressure): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bloodPressure);
    return this.http
      .patch<RestBloodPressure>(`${this.resourceUrl}/${this.getBloodPressureIdentifier(bloodPressure)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestBloodPressure>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestBloodPressure[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestBloodPressure[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  getBloodPressureIdentifier(bloodPressure: Pick<IBloodPressure, 'id'>): number {
    return bloodPressure.id;
  }

  compareBloodPressure(o1: Pick<IBloodPressure, 'id'> | null, o2: Pick<IBloodPressure, 'id'> | null): boolean {
    return o1 && o2 ? this.getBloodPressureIdentifier(o1) === this.getBloodPressureIdentifier(o2) : o1 === o2;
  }

  addBloodPressureToCollectionIfMissing<Type extends Pick<IBloodPressure, 'id'>>(
    bloodPressureCollection: Type[],
    ...bloodPressuresToCheck: (Type | null | undefined)[]
  ): Type[] {
    const bloodPressures: Type[] = bloodPressuresToCheck.filter(isPresent);
    if (bloodPressures.length > 0) {
      const bloodPressureCollectionIdentifiers = bloodPressureCollection.map(
        bloodPressureItem => this.getBloodPressureIdentifier(bloodPressureItem)!
      );
      const bloodPressuresToAdd = bloodPressures.filter(bloodPressureItem => {
        const bloodPressureIdentifier = this.getBloodPressureIdentifier(bloodPressureItem);
        if (bloodPressureCollectionIdentifiers.includes(bloodPressureIdentifier)) {
          return false;
        }
        bloodPressureCollectionIdentifiers.push(bloodPressureIdentifier);
        return true;
      });
      return [...bloodPressuresToAdd, ...bloodPressureCollection];
    }
    return bloodPressureCollection;
  }

  protected convertDateFromClient<T extends IBloodPressure | NewBloodPressure | PartialUpdateBloodPressure>(bloodPressure: T): RestOf<T> {
    return {
      ...bloodPressure,
      timestamp: bloodPressure.timestamp?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restBloodPressure: RestBloodPressure): IBloodPressure {
    return {
      ...restBloodPressure,
      timestamp: restBloodPressure.timestamp ? dayjs(restBloodPressure.timestamp) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestBloodPressure>): HttpResponse<IBloodPressure> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestBloodPressure[]>): HttpResponse<IBloodPressure[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
