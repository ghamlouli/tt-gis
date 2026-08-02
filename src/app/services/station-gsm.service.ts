import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { StationGsm } from '../models/station-gsm.model';

@Injectable({ providedIn: 'root' })
export class StationGsmService {
  private readonly baseUrl = `${API_BASE_URL}/stations-gsm`;

  constructor(private http: HttpClient) {}

  create(payload: StationGsm): Observable<StationGsm> {
    return this.http.post<StationGsm>(this.baseUrl, payload);
  }

  list(idGouv: number | null, idDelegation: number | null, fournisseur: string | null): Observable<StationGsm[]> {
    let params = new HttpParams();
    if (idGouv) params = params.set('idGouv', idGouv);
    if (idDelegation) params = params.set('idDelegation', idDelegation);
    if (fournisseur) params = params.set('fournisseur', fournisseur);
    return this.http.get<StationGsm[]>(this.baseUrl, { params });
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  update(id: number, payload: StationGsm): Observable<StationGsm> {
    return this.http.put<StationGsm>(`${this.baseUrl}/${id}`, payload);
  }
}
