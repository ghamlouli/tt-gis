import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { GisCloudRow } from '../models/gis-cloud.model';

@Injectable({ providedIn: 'root' })
export class GisCloudService {
  private readonly baseUrl = `${API_BASE_URL}/gis-cloud`;

  constructor(private http: HttpClient) {}

  list(idGouv: number | null, idDelegation: number | null, acces: string | null): Observable<GisCloudRow[]> {
    let params = new HttpParams();
    if (idGouv) params = params.set('idGouv', idGouv);
    if (idDelegation) params = params.set('idDelegation', idDelegation);
    if (acces) params = params.set('acces', acces);
    return this.http.get<GisCloudRow[]>(this.baseUrl, { params });
  }
}
