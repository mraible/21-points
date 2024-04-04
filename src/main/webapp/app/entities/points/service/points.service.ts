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
import { IPoints, NewPoints } from '../points.model';

export type PartialUpdatePoints = Partial<IPoints> & Pick<IPoints, 'id'>;

type RestOf<T extends IPoints | NewPoints> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestPoints = RestOf<IPoints>;

export type NewRestPoints = RestOf<NewPoints>;

export type PartialUpdateRestPoints = RestOf<PartialUpdatePoints>;

export type EntityResponseType = HttpResponse<IPoints>;
export type EntityArrayResponseType = HttpResponse<IPoints[]>;

@Injectable({ providedIn: 'root' })
export class PointsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/points');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/_search/points');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(points: NewPoints): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(points);
    return this.http
      .post<RestPoints>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(points: IPoints): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(points);
    return this.http
      .put<RestPoints>(`${this.resourceUrl}/${this.getPointsIdentifier(points)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(points: PartialUpdatePoints): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(points);
    return this.http
      .patch<RestPoints>(`${this.resourceUrl}/${this.getPointsIdentifier(points)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPoints>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPoints[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPoints[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  getPointsIdentifier(points: Pick<IPoints, 'id'>): number {
    return points.id;
  }

  comparePoints(o1: Pick<IPoints, 'id'> | null, o2: Pick<IPoints, 'id'> | null): boolean {
    return o1 && o2 ? this.getPointsIdentifier(o1) === this.getPointsIdentifier(o2) : o1 === o2;
  }

  addPointsToCollectionIfMissing<Type extends Pick<IPoints, 'id'>>(
    pointsCollection: Type[],
    ...pointsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const points: Type[] = pointsToCheck.filter(isPresent);
    if (points.length > 0) {
      const pointsCollectionIdentifiers = pointsCollection.map(pointsItem => this.getPointsIdentifier(pointsItem)!);
      const pointsToAdd = points.filter(pointsItem => {
        const pointsIdentifier = this.getPointsIdentifier(pointsItem);
        if (pointsCollectionIdentifiers.includes(pointsIdentifier)) {
          return false;
        }
        pointsCollectionIdentifiers.push(pointsIdentifier);
        return true;
      });
      return [...pointsToAdd, ...pointsCollection];
    }
    return pointsCollection;
  }

  protected convertDateFromClient<T extends IPoints | NewPoints | PartialUpdatePoints>(points: T): RestOf<T> {
    return {
      ...points,
      date: points.date?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restPoints: RestPoints): IPoints {
    return {
      ...restPoints,
      date: restPoints.date ? dayjs(restPoints.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPoints>): HttpResponse<IPoints> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPoints[]>): HttpResponse<IPoints[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
