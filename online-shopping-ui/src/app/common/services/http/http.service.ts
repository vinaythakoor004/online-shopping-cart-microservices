import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) { }

  get<T>(url: string, paramsObj?: HttpParams | undefined): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http
        .get<any>(url, { params: paramsObj })
        .pipe(catchError(this.errorHandler));
    } else {
      return of(null);
    }
  }

  post<T>(
    url: string,
    body?: T | null,
    paramsObj?: HttpParams | undefined
  ): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http
        .post<any>(url, body, { params: paramsObj })
        .pipe(catchError(this.errorHandler));
    } else {
      return of(null);
    }
  }

  put<T>(
    url: string,
    body?: T | null,
    paramsObj?: HttpParams | undefined
  ): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http
        .put<any>(url, body, { params: paramsObj })
        .pipe(catchError(this.errorHandler));
    } else {
      return of(null);
    }
  }

  delete<T>(
    url: string,
    body?: T | null,
    paramsObj?: HttpParams | undefined
  ): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http
        .delete<any>(url)
        .pipe(catchError(this.errorHandler));
    } else {
      return of(null);
    }
  }

  errorHandler(error: any): Observable<any> {
    return error;
  }
}
