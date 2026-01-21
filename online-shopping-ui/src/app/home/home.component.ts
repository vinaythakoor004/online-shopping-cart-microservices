import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HomeService } from './service/home.service';
import { CommonModule } from '@angular/common';
import { Product } from '../common/model/product.model';
import {MatCardModule} from '@angular/material/card';
import { LoaderService } from '../common/services/loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [ MatProgressSpinnerModule, CommonModule, MatCardModule ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  isLoading: boolean = false;
  productList: Array<Product> = [];
  groupedProductsList: any[][] = [];

  constructor(private homeService: HomeService, private loaderService: LoaderService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loaderService.show();
    this.homeService.getProductData().subscribe({
      next: (data: Array<Product>) => {
        this.loaderService.hide();
        this.productList = data;
        this.groupedProductsList = this.mapCarousalProductList(this.productList, 3);

        console.log(data);
      },
      error: (err) => {
        this.loaderService.hide();
        console.log(err);
      }
    })
  }

  mapCarousalProductList(arr: any[], size: number): any[][] {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }

  showProductDetails(product: Product): void {
    console.log('Product Name:', product);
    this.homeService.setSelectedProduct(product);
    this.router.navigate(['/product', product.name]);
  }


}
