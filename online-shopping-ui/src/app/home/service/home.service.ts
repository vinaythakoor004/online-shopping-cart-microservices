import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private apiUrl = '/api/product';

  constructor(private http: HttpClient) { }

    getProductData(): Observable<any> {
      return this.http.get(this.apiUrl);
    }

    saveProductData(data: any): Observable<any> {
      return this.http.post(this.apiUrl, data);
    }
}
