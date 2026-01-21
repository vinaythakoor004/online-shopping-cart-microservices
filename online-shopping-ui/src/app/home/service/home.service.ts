import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../common/model/product.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private apiUrl = '/api/product';

  constructor(private http: HttpClient) { }
    private selectedProduct: Product | null = null;
    setSelectedProduct(product: Product): void {
      this.selectedProduct = product;
    }

    getSelectedProduct(): Product | null {
      return this.selectedProduct;
    }

    getProFile(): Observable<any> {
      return this.http.get('/api/user/me');
    }

    getProductData(): Observable<any> {
      return this.http.get(this.apiUrl);
    }

    addProductDetails(data: any): Observable<any> {
      return this.http.post(this.apiUrl, data);
    }

    bulkUploadProducts(data: FormData): Observable<any> {
      return this.http.post(`${this.apiUrl}/bulk`, data);
    }

    updateProductDetails(productId: string, data: any): Observable<any> {
      return this.http.put(`${this.apiUrl}/${productId}`, data);
    }

    deleteProduct(productId: string): Observable<any> {
      return this.http.delete(`${this.apiUrl}/${productId}`);
    }
}
