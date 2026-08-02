import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { Msan } from '../models/msan.model';

@Injectable({ providedIn: 'root' })
export class MsanService {
  private readonly baseUrl = `${API_BASE_URL}/msan`;

  constructor(private http: HttpClient) {}

  create(payload: Msan): Observable<Msan> {
    return this.http.post<Msan>(this.baseUrl, payload);
  }

  list(idGouv: number | null, idDelegation: number | null): Observable<Msan[]> {
    let params = new HttpParams();
    if (idGouv) params = params.set('idGouv', idGouv);
    if (idDelegation) params = params.set('idDelegation', idDelegation);
    return this.http.get<Msan[]>(this.baseUrl, { params });
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  update(id: number, payload: Msan): Observable<Msan> {
    return this.http.put<Msan>(`${this.baseUrl}/${id}`, payload);
  }
}
