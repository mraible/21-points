import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ElasticsearchReindexService {
  constructor(private http: HttpClient) {}

  reindex(): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>('api/elasticsearch/index', { observe: 'response' });
  }

  reindexSelected(selectedEntities: string[]): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>('api/elasticsearch/selected', selectedEntities, { observe: 'response' });
  }
}
