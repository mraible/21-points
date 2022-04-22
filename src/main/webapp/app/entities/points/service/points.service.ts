import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IPoints, getPointsIdentifier } from '../points.model';

export type EntityResponseType = HttpResponse<IPoints>;
export type EntityArrayResponseType = HttpResponse<IPoints[]>;

@Injectable({ providedIn: 'root' })
export class PointsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/points');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/points');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(points: IPoints): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(points);
    return this.http
      .post<IPoints>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(points: IPoints): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(points);
    return this.http
      .put<IPoints>(`${this.resourceUrl}/${getPointsIdentifier(points) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(points: IPoints): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(points);
    return this.http
      .patch<IPoints>(`${this.resourceUrl}/${getPointsIdentifier(points) as number}`, copy, { observe: 'response' })
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

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPoints[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  addPointsToCollectionIfMissing(pointsCollection: IPoints[], ...pointsToCheck: (IPoints | null | undefined)[]): IPoints[] {
    const points: IPoints[] = pointsToCheck.filter(isPresent);
    if (points.length > 0) {
      const pointsCollectionIdentifiers = pointsCollection.map(pointsItem => getPointsIdentifier(pointsItem)!);
      const pointsToAdd = points.filter(pointsItem => {
        const pointsIdentifier = getPointsIdentifier(pointsItem);
        if (pointsIdentifier == null || pointsCollectionIdentifiers.includes(pointsIdentifier)) {
          return false;
        }
        pointsCollectionIdentifiers.push(pointsIdentifier);
        return true;
      });
      return [...pointsToAdd, ...pointsCollection];
    }
    return pointsCollection;
  }

  protected convertDateFromClient(points: IPoints): IPoints {
    return Object.assign({}, points, {
      date: points.date?.isValid() ? points.date.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((points: IPoints) => {
        points.date = points.date ? dayjs(points.date) : undefined;
      });
    }
    return res;
  }
}
