import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IWeight, getWeightIdentifier } from '../weight.model';

export type EntityResponseType = HttpResponse<IWeight>;
export type EntityArrayResponseType = HttpResponse<IWeight[]>;

@Injectable({ providedIn: 'root' })
export class WeightService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/weights');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/weights');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(weight: IWeight): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(weight);
    return this.http
      .post<IWeight>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(weight: IWeight): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(weight);
    return this.http
      .put<IWeight>(`${this.resourceUrl}/${getWeightIdentifier(weight) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(weight: IWeight): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(weight);
    return this.http
      .patch<IWeight>(`${this.resourceUrl}/${getWeightIdentifier(weight) as number}`, copy, { observe: 'response' })
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

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IWeight[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  addWeightToCollectionIfMissing(weightCollection: IWeight[], ...weightsToCheck: (IWeight | null | undefined)[]): IWeight[] {
    const weights: IWeight[] = weightsToCheck.filter(isPresent);
    if (weights.length > 0) {
      const weightCollectionIdentifiers = weightCollection.map(weightItem => getWeightIdentifier(weightItem)!);
      const weightsToAdd = weights.filter(weightItem => {
        const weightIdentifier = getWeightIdentifier(weightItem);
        if (weightIdentifier == null || weightCollectionIdentifiers.includes(weightIdentifier)) {
          return false;
        }
        weightCollectionIdentifiers.push(weightIdentifier);
        return true;
      });
      return [...weightsToAdd, ...weightCollection];
    }
    return weightCollection;
  }

  protected convertDateFromClient(weight: IWeight): IWeight {
    return Object.assign({}, weight, {
      timestamp: weight.timestamp?.isValid() ? weight.timestamp.toJSON() : undefined,
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
      res.body.forEach((weight: IWeight) => {
        weight.timestamp = weight.timestamp ? dayjs(weight.timestamp) : undefined;
      });
    }
    return res;
  }
}
