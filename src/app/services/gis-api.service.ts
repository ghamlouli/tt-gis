import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';

export type GisResource =
  | 'cables-cuivre'
  | 'cellules-gsm'
  | 'clients-radio'
  | 'delegations'
  | 'documentation-gsm'
  | 'gouvernorats'
  | 'liens-fh'
  | 'liens-fo'
  | 'metroethernets'
  | 'msan'
  | 'stations-gsm'
  | 'switch-outdoor';

@Injectable({
  providedIn: 'root'
})
export class GisApiService {
  constructor(private http: HttpClient) {}

  list<T>(resource: GisResource): Observable<T[]> {
    return this.http.get<T[]>(this.url(resource));
  }

  getById<T>(resource: GisResource, id: number | string): Observable<T> {
    return this.http.get<T>(`${this.url(resource)}/${id}`);
  }

  create<TPayload, TResponse>(
    resource: GisResource,
    payload: TPayload
  ): Observable<TResponse> {
    return this.http.post<TResponse>(this.url(resource), payload);
  }

  update<TPayload, TResponse>(
    resource: GisResource,
    id: number | string,
    payload: TPayload
  ): Observable<TResponse> {
    return this.http.put<TResponse>(`${this.url(resource)}/${id}`, payload);
  }

  remove(resource: GisResource, id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.url(resource)}/${id}`);
  }

  ping(): Observable<string> {
    return this.http.get(`${API_BASE_URL}/ping`, { responseType: 'text' });
  }

  private url(resource: GisResource): string {
    return `${API_BASE_URL}/${resource}`;
  }
}

