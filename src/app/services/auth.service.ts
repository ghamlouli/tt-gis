import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, tap, timeout } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import {
  AuthResult,
  ForgotPasswordPayload,
  RegisterPayload,
  SessionUser
} from '../models/user.model';

const SESSION_KEY = 'user';
const AUTH_TIMEOUT_MS = 8000;
export const AUTH_TOKEN_KEY = 'tt-gis-auth-token';

type BackendAuthResponse = {
  token: string;
  login: string;
  nom: string;
  prenom: string;
  matricule: string;
  profil: string;
};

type BackendLookupResponse = {
  login: string;
  nom: string;
  prenom: string;
  matricule: string;
  profil: string;
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  register(payload: RegisterPayload): Observable<AuthResult> {
    return this.http.post(`${API_BASE_URL}/auth/register`, payload).pipe(
      timeout(AUTH_TIMEOUT_MS),
      map(() => ({ success: true } as AuthResult)),
      catchError(error => of(this.toAuthError(error, 'Création impossible. Vérifiez que le backend est lancé sur le port 8081.')))
    );
  }

  registerAndRedirectToLogin(payload: RegisterPayload): Observable<AuthResult> {
    return this.register(payload).pipe(
      tap(result => {
        if (result.success) {
          this.router.navigate(['/login'], { queryParams: { login: payload.login } });
        }
      })
    );
  }

  login(login: string, motDePasse: string): Observable<AuthResult> {
    const normalizedLogin = login.trim();

    if (!normalizedLogin || !motDePasse) {
      return of({
        success: false,
        message: 'Veuillez renseigner votre login et votre mot de passe.'
      });
    }

    console.log('Tentative de login pour:', normalizedLogin);
    console.log('URL API:', `${API_BASE_URL}/auth/login`);

    return this.http.post<BackendAuthResponse>(`${API_BASE_URL}/auth/login`, {
      login: normalizedLogin,
      motDePasse
    }).pipe(
      timeout(AUTH_TIMEOUT_MS),
      map(response => {
        console.log('Réponse backend:', response);
        return this.storeSession(response);
      }),
      catchError(error => {
        console.error('Erreur login:', error);
        return of(this.toAuthError(error, 'Mot de passe incorrecte, réessayer'));
      })
    );
  }

  loginAndRedirect(login: string, motDePasse: string): Observable<AuthResult> {
    return this.login(login, motDePasse).pipe(
      tap(result => {
        if (result.success) {
          this.router.navigate(['/workspace']);
        }
      })
    );
  }

  lookupByLogin(login: string): Observable<BackendLookupResponse | null> {
    if (!login.trim()) {
      return of(null);
    }
    return this.http.get<BackendLookupResponse>(`${API_BASE_URL}/auth/lookup/${encodeURIComponent(login.trim())}`).pipe(
      timeout(AUTH_TIMEOUT_MS),
      catchError(() => of(null))
    );
  }

  forgotPassword(payload: ForgotPasswordPayload): Observable<AuthResult> {
    return this.http.put(`${API_BASE_URL}/auth/forgot-password`, payload).pipe(
      timeout(AUTH_TIMEOUT_MS),
      map(() => ({ success: true } as AuthResult)),
      catchError(error => of(this.toAuthError(error, 'Réinitialisation impossible. Vérifiez que le backend est lancé sur le port 8081.')))
    );
  }

  forgotPasswordAndRedirectToLogin(payload: ForgotPasswordPayload): Observable<AuthResult> {
    return this.forgotPassword(payload).pipe(
      tap(result => {
        if (result.success) {
          this.router.navigate(['/login'], { queryParams: { login: payload.login } });
        }
      })
    );
  }

  isAuthenticated(): boolean {
    return Boolean(this.getCurrentUser() && this.getToken());
  }

  getCurrentUser(): SessionUser | null {
    const rawUser = localStorage.getItem(SESSION_KEY);

    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as SessionUser;
    } catch {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  getCurrentProfil(): string {
    const user = this.getCurrentUser();
    return String(user?.profil ?? 'Visiteur');
  }

  getDisplayName(): string {
    const user = this.getCurrentUser();

    if (!user) {
      return 'Visiteur';
    }

    return `${user.prenom} ${user.nom}`.trim();
  }

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  private storeSession(response: BackendAuthResponse): AuthResult {
    const sessionUser: SessionUser = {
      login: response.login,
      nom: response.nom,
      prenom: response.prenom,
      matricule: response.matricule,
      profil: response.profil as SessionUser['profil']
    };

    localStorage.setItem(AUTH_TOKEN_KEY, response.token);
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));

    return { success: true };
  }

  private toAuthError(error: unknown, fallbackMessage: string): AuthResult {
    if (error instanceof HttpErrorResponse) {
      const backendMessage = this.extractBackendMessage(error.error);

      return {
        success: false,
        message: backendMessage || fallbackMessage
      };
    }

    return {
      success: false,
      message: fallbackMessage
    };
  }

  private extractBackendMessage(errorBody: unknown): string {
    if (typeof errorBody === 'string') {
      return errorBody;
    }

    if (errorBody && typeof errorBody === 'object' && 'message' in errorBody) {
      return String((errorBody as { message: unknown }).message);
    }

    return '';
  }
}
