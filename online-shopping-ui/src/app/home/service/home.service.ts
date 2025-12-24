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

    addProductDetails(data: any): Observable<any> {
      return this.http.post(this.apiUrl, data);
    }

    updateProductDetails(productId: string, data: any): Observable<any> {
      return this.http.put(`${this.apiUrl}/${productId}`, data);
    }

    deleteProduct(productId: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/${productId}`);
    }
}
