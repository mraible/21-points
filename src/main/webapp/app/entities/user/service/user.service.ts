import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, asapScheduler, scheduled } from 'rxjs';

import { catchError } from 'rxjs/operators';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IUser } from '../user.model';

export type EntityResponseType = HttpResponse<IUser>;
export type EntityArrayResponseType = HttpResponse<IUser[]>;

@Injectable({ providedIn: 'root' })
export class UserService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/users');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/users/_search');

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUser>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUser[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IUser[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(catchError(() => scheduled([new HttpResponse<IUser[]>()], asapScheduler)));
  }

  getUserIdentifier(user: Pick<IUser, 'id'>): number {
    return user.id;
  }

  compareUser(o1: Pick<IUser, 'id'> | null, o2: Pick<IUser, 'id'> | null): boolean {
    return o1 && o2 ? this.getUserIdentifier(o1) === this.getUserIdentifier(o2) : o1 === o2;
  }

  addUserToCollectionIfMissing<Type extends Pick<IUser, 'id'>>(
    userCollection: Type[],
    ...usersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const users: Type[] = usersToCheck.filter(isPresent);
    if (users.length > 0) {
      const userCollectionIdentifiers = userCollection.map(userItem => this.getUserIdentifier(userItem));
      const usersToAdd = users.filter(userItem => {
        const userIdentifier = this.getUserIdentifier(userItem);
        if (userCollectionIdentifiers.includes(userIdentifier)) {
          return false;
        }
        userCollectionIdentifiers.push(userIdentifier);
        return true;
      });
      return [...usersToAdd, ...userCollection];
    }
    return userCollection;
  }
}
