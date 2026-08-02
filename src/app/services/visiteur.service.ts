import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { Visiteur } from '../models/visiteur.model';

@Injectable({
  providedIn: 'root'
})
export class VisiteurService {
  private apiUrl = `${API_BASE_URL}/visiteurs`;

  constructor(private http: HttpClient) {}

  create(visiteur: Visiteur): Observable<Visiteur> {
    return this.http.post<Visiteur>(this.apiUrl, visiteur);
  }

  list(): Observable<Visiteur[]> {
    return this.http.get<Visiteur[]>(this.apiUrl);
  }

  getById(id: number): Observable<Visiteur> {
    return this.http.get<Visiteur>(`${this.apiUrl}/${id}`);
  }

  update(id: number, visiteur: Visiteur): Observable<Visiteur> {
    return this.http.put<Visiteur>(`${this.apiUrl}/${id}`, visiteur);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
