import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { MetroEthernet } from '../models/metro-ethernet.model';

@Injectable({ providedIn: 'root' })
export class MetroEthernetService {
  private readonly baseUrl = `${API_BASE_URL}/metroethernets`;

  constructor(private http: HttpClient) {}

  create(payload: MetroEthernet): Observable<MetroEthernet> {
    return this.http.post<MetroEthernet>(this.baseUrl, payload);
  }

  list(idGouv: number | null, idDelegation: number | null): Observable<MetroEthernet[]> {
    let params = new HttpParams();
    if (idGouv) params = params.set('idGouv', idGouv);
    if (idDelegation) params = params.set('idDelegation', idDelegation);
    return this.http.get<MetroEthernet[]>(this.baseUrl, { params });
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  update(id: number, payload: MetroEthernet): Observable<MetroEthernet> {
    return this.http.put<MetroEthernet>(`${this.baseUrl}/${id}`, payload);
  }
}
