import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { SwitchOutdoor } from '../models/switch-outdoor.model';

@Injectable({ providedIn: 'root' })
export class SwitchOutdoorService {
  private readonly baseUrl = `${API_BASE_URL}/switch-outdoor`;

  constructor(private http: HttpClient) {}

  create(payload: SwitchOutdoor): Observable<SwitchOutdoor> {
    return this.http.post<SwitchOutdoor>(this.baseUrl, payload);
  }

  list(idGouv: number | null, idDelegation: number | null): Observable<SwitchOutdoor[]> {
    let params = new HttpParams();
    if (idGouv) params = params.set('idGouv', idGouv);
    if (idDelegation) params = params.set('idDelegation', idDelegation);
    return this.http.get<SwitchOutdoor[]>(this.baseUrl, { params });
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  update(id: number, payload: SwitchOutdoor): Observable<SwitchOutdoor> {
    return this.http.put<SwitchOutdoor>(`${this.baseUrl}/${id}`, payload);
  }
}
