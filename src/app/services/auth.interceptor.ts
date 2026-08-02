import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { AUTH_TOKEN_KEY } from './auth.service';

const SESSION_KEY = 'user';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const isApiCall = request.url.startsWith(API_BASE_URL);

  const authorizedRequest = (!token || !isApiCall)
    ? request
    : request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

  return next(authorizedRequest).pipe(
    catchError((error: unknown) => {
      // Session expirée ou token invalide (cf. JwtAuthFilter côté backend) :
      // on nettoie la session locale et on redirige vers le login au lieu
      // de laisser l'écran afficher silencieusement "aucune donnée".
      if (isApiCall && error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
        const isAuthEndpoint = request.url.includes('/auth/login') || request.url.includes('/auth/register');

        if (!isAuthEndpoint) {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem(SESSION_KEY);
          router.navigate(['/login'], { queryParams: { sessionExpired: '1' } });
        }
      }

      return throwError(() => error);
    })
  );
};

