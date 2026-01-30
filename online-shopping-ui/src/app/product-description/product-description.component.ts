import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home/service/home.service';
import { Product } from '../common/model/product.model';
import { MatCardModule } from '@angular/material/card';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-description',
  imports: [ MatCardModule, CurrencyPipe ],
  templateUrl: './product-description.component.html',
  styleUrl: './product-description.component.css',
})
export class ProductDescriptionComponent implements OnInit {
  constructor(private homeService: HomeService, private router: Router) {}
  selectedProduct: Product | null = null;

  ngOnInit(): void {
    this.selectedProduct = this.homeService.getSelectedProduct();
    console.log('Selected Product:', this.selectedProduct);
  }

  goBack(): void {
    // this.homeService.setSelectedProduct();
    this.router.navigate(['/home']);
  }

  addToCart(product: Product | null): void {
    if (product) {
      this.router.navigate(['/viewcart']);
    }
  }

  buyNow(product: Product | null): void {
    if (product) {
      this.router.navigate(['/product']);
    }
  }
}
