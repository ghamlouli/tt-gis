import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { Delegation, Gouvernorat } from '../models/geo.model';

@Injectable({ providedIn: 'root' })
export class GeoService {
  constructor(private http: HttpClient) {}

  listGouvernorats(): Observable<Gouvernorat[]> {
    return this.http.get<Gouvernorat[]>(`${API_BASE_URL}/gouvernorats`);
  }

  listDelegationsByGouvernorat(idGouv: number): Observable<Delegation[]> {
    return this.http.get<Delegation[]>(`${API_BASE_URL}/delegations/gouvernorat/${idGouv}`);
  }
}
