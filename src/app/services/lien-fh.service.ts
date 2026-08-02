import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { LienFH } from '../models/lien-fh.model';

@Injectable({ providedIn: 'root' })
export class LienFHService {
  private readonly baseUrl = `${API_BASE_URL}/liens-fh`;

  constructor(private http: HttpClient) {}

  create(payload: LienFH): Observable<LienFH> {
    return this.http.post<LienFH>(this.baseUrl, payload);
  }

  list(idGouv: number | null, idDelegation: number | null): Observable<LienFH[]> {
    let params = new HttpParams();
    if (idGouv) params = params.set('idGouv', idGouv);
    if (idDelegation) params = params.set('idDelegation', idDelegation);
    return this.http.get<LienFH[]>(this.baseUrl, { params });
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  update(id: number, payload: LienFH): Observable<LienFH> {
    return this.http.put<LienFH>(`${this.baseUrl}/${id}`, payload);
  }
}
