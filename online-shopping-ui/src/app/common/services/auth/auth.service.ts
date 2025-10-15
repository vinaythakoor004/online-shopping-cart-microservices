import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, timer } from 'rxjs';
import { tap, catchError, first, shareReplay, switchMap, delay } from 'rxjs/operators';
import { Router } from '@angular/router';

interface AuthStatusResponse {
  isAuthenticated: boolean;
  user: user | null;
  message: string;
}

interface user {
  email: string | "";
  googleId: string;
  id: number;
  name: string;
  pictureUrl: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  private _authenticatedUser = new BehaviorSubject<user | null>(null);
  isAuthenticated$ = this._isAuthenticated.asObservable();
  authenticatedUser$ = this._authenticatedUser.asObservable();

  // userEmail: string = "";
  user: user | null = null;

  // Cache for the last authentication check result (Observable)
  private authCheckObservable: Observable<AuthStatusResponse> | null = null;
  private lastCheckTime: number = 0;
  private readonly CACHE_DURATION_MS = 5 * 60 * 1000; // Cache for 5 minutes

  constructor(private http: HttpClient, private router: Router) { }

  get isLoggedIn(): boolean {
    return true; //this._isAuthenticated.value;
  }

  /**
   * Calls the backend to check the current authentication status.
   * Caches the result for a defined duration to avoid redundant API calls.
   */
  checkAuthStatus(forceRefresh: boolean = false): Observable<AuthStatusResponse> {
    const now = Date.now();

    // If a check is already in progress AND it's not a forced refresh, return the existing observable
    if (this.authCheckObservable && !forceRefresh) {
      return this.authCheckObservable;
    }

    // If status is known and within cache duration, return cached value without API call
    if (!forceRefresh && (now - this.lastCheckTime < this.CACHE_DURATION_MS) && this._isAuthenticated.value !== null) {
      return of({
        isAuthenticated: this._isAuthenticated.value,
        user: this.user,
        message: 'Cached status'
      });
    }

    // Use the delay operator to introduce a 500ms delay before the HTTP request
    this.authCheckObservable = of(null).pipe(
    // delay(500),
    switchMap(() => this.http.get<AuthStatusResponse>('/api/auth/status')), // <-- Send the HTTP request after the delay
    tap(response => {
      this._isAuthenticated.next(response.isAuthenticated);
      this._authenticatedUser.next(response.user);
      this.user = response.user;
      this.lastCheckTime = Date.now();
    }),
    catchError(error => {
      this._isAuthenticated.next(false);
      this._authenticatedUser.next(null);
      this.user = null;
      this.lastCheckTime = 0;
      return of({ isAuthenticated: false, user: null, message: 'Error checking status' });
    }),
    shareReplay(1)
  );

    return this.authCheckObservable;
  }

  logout(): void {
    this.http.get<string>('/api/auth/logout').pipe(
      tap(() => {
        this._isAuthenticated.next(false);
        this._authenticatedUser.next(null);
        this.user = null;
        this.lastCheckTime = 0; // Invalidate cache
        this.authCheckObservable = null; // Clear any pending check
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        this._isAuthenticated.next(false);
        this._authenticatedUser.next(null);
        this.user = null;
        this.lastCheckTime = 0;
        this.authCheckObservable = null;
        this.router.navigate(['/login']);
        return of('Logout failed');
      })
    ).subscribe();
  }
}
