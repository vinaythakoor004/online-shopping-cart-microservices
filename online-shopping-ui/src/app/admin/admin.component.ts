import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { HomeService } from '../home/service/home.service';
import { AlertService } from '../common/services/alert/alert.service';
import {MatTabsModule} from '@angular/material/tabs';
import { Product } from '../common/model/product.model';
import { AddProductComponent } from "./add-product/add-product.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface adminTab {
  label: string;
  content: string;
}

@Component({
  selector: 'app-admin',
  imports: [CommonModule, MatTabsModule, AddProductComponent, MatButtonModule, MatDialogModule ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  productList: Array<Product> = [];

  constructor(private homeService: HomeService, private alertService: AlertService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.homeService.getProductData().subscribe({
      next: (data: Array<Product>) => {
        this.productList = data;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  onProductAdded(event: any): void {
    this.getProducts();
  }

  deleteProduct(productId: string): void {
    this.homeService.deleteProduct(productId).subscribe({
      next: (data) => {
        this.alertService.openSnackBar('Product deleted successfully!');
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  readonly dialog = inject(MatDialog);

  upateProduct(product: Product): void {
    const dialogRef = this.dialog.open(AddProductComponent, {
      panelClass: 'custom-dialog-container',
      width: '60vw',
      height: '39rem',
      maxWidth: '100vw',
      data: { product: product }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
