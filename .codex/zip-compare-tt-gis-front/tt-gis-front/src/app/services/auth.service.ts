import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map, of, shareReplay, tap } from 'rxjs';

import {
  AuthResult,
  ROLE_OPTIONS,
  SessionUser,
  SignUpPayload,
  User,
  UserRole
} from '../models/user.model';

const USERS_URL = '/assets/data/users.json';
const SESSION_KEY = 'user';
const REGISTERED_USERS_KEY = 'tt-gis-registered-users';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCache$?: Observable<User[]>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(identifier: string, password: string): Observable<AuthResult> {
    const normalizedIdentifier = identifier.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (!normalizedIdentifier || !normalizedPassword) {
      return of({
        success: false,
        message: 'Veuillez renseigner votre email et votre mot de passe.'
      });
    }

    return this.getAllUsers().pipe(
      map(users => this.authenticate(users, normalizedIdentifier, normalizedPassword))
    );
  }

  signUp(payload: SignUpPayload): Observable<AuthResult> {
    const nom = payload.nom.trim();
    const prenom = payload.prenom.trim();
    const email = payload.email.trim().toLowerCase();
    const telephone = payload.telephone.trim();
    const password = payload.password.trim();
    const role = payload.role;

    if (!nom || !prenom || !email || !telephone || !password || !role) {
      return of({
        success: false,
        message: 'Tous les champs sont obligatoires, y compris le rôle.'
      });
    }

    if (!ROLE_OPTIONS.some(option => option.value === role)) {
      return of({
        success: false,
        message: 'Veuillez sélectionner un rôle valide.'
      });
    }

    if (!this.isValidEmail(email)) {
      return of({
        success: false,
        message: 'Adresse email invalide.'
      });
    }

    if (!this.isValidPhone(telephone)) {
      return of({
        success: false,
        message: 'Numéro de téléphone invalide.'
      });
    }

    if (password.length < 4) {
      return of({
        success: false,
        message: 'Le mot de passe doit contenir au moins 4 caractères.'
      });
    }

    return this.getAllUsers().pipe(
      map(users => {
        const emailExists = users.some(user => user.email.toLowerCase() === email);

        if (emailExists) {
          return {
            success: false,
            message: 'Un compte existe déjà avec cet email.'
          } as AuthResult;
        }

        const newUser: User = {
          id_utilisateur: this.createUserId(users),
          username: email.split('@')[0],
          nom,
          prenom,
          email,
          telephone,
          mot_de_passe: password,
          statut: 'Actif',
          roles: [role]
        };

        const registeredUsers = this.readRegisteredUsers();
        registeredUsers.push(newUser);
        localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registeredUsers));

        const sessionUser = this.toSessionUser(newUser);
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));

        return {
          success: true,
          user: sessionUser
        } as AuthResult;
      })
    );
  }

  loginAndRedirect(identifier: string, password: string): Observable<AuthResult> {
    return this.login(identifier, password).pipe(
      tap(result => {
        if (result.success) {
          this.router.navigate(['/workspace']);
        }
      })
    );
  }

  signUpAndRedirect(payload: SignUpPayload): Observable<AuthResult> {
    return this.signUp(payload).pipe(
      tap(result => {
        if (result.success) {
          this.router.navigate(['/workspace']);
        }
      })
    );
  }

  isAuthenticated(): boolean {
    return Boolean(this.getCurrentUser());
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
      return null;
    }
  }

  getCurrentRole(): UserRole | 'VISITEUR' {
    const user = this.getCurrentUser();
    return (user?.roles?.[0] ?? 'VISITEUR') as UserRole | 'VISITEUR';
  }

  getCurrentRoleLabel(): string {
    const role = this.getCurrentRole();

    if (role === 'VISITEUR') {
      return 'Visiteur';
    }

    return ROLE_OPTIONS.find(option => option.value === role)?.label ?? role;
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
    this.router.navigate(['/']);
  }

  private getAllUsers(): Observable<User[]> {
    return this.getBaseUsers().pipe(
      map(users => [...users, ...this.readRegisteredUsers()])
    );
  }

  private getBaseUsers(): Observable<User[]> {
    if (!this.usersCache$) {
      this.usersCache$ = this.http.get<User[]>(USERS_URL).pipe(shareReplay(1));
    }

    return this.usersCache$;
  }

  private readRegisteredUsers(): User[] {
    const rawUsers = localStorage.getItem(REGISTERED_USERS_KEY);

    if (!rawUsers) {
      return [];
    }

    try {
      return JSON.parse(rawUsers) as User[];
    } catch {
      localStorage.removeItem(REGISTERED_USERS_KEY);
      return [];
    }
  }

  private authenticate(
    users: User[],
    identifier: string,
    password: string
  ): AuthResult {
    const user = users.find(candidate =>
      this.matchesIdentifier(candidate, identifier) &&
      candidate.mot_de_passe === password
    );

    if (!user) {
      return {
        success: false,
        message: 'Email ou mot de passe incorrect.'
      };
    }

    if (user.statut !== 'Actif') {
      return {
        success: false,
        message: 'Ce compte est désactivé.'
      };
    }

    const sessionUser = this.toSessionUser(user);
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));

    return {
      success: true,
      user: sessionUser
    };
  }

  private matchesIdentifier(user: User, identifier: string): boolean {
    return [user.username, user.email]
      .filter((value): value is string => Boolean(value))
      .some(value => value.toLowerCase() === identifier);
  }

  private toSessionUser(user: User): SessionUser {
    const { mot_de_passe: _password, ...sessionUser } = user;
    return sessionUser;
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private isValidPhone(telephone: string): boolean {
    return /^[\d\s+()-]{8,20}$/.test(telephone);
  }

  private createUserId(users: User[]): number {
    const highestId = users.reduce(
      (maxId, user) => Math.max(maxId, user.id_utilisateur),
      0
    );

    return highestId + 1;
  }
}
