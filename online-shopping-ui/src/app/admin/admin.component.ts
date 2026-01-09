import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { HomeService } from '../home/service/home.service';
import { AlertService } from '../common/services/alert/alert.service';
import {MatTabsModule} from '@angular/material/tabs';
import { Product } from '../common/model/product.model';
import { AddProductComponent } from "./add-product/add-product.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { LoaderService } from '../common/services/loader/loader.service';
import { PopupService } from '../common/services/popup/popup.service';
import { TranslatePipe } from '@ngx-translate/core';

export interface adminTab {
  label: string;
  content: string;
}

@Component({
  selector: 'app-admin',
  imports: [CommonModule, MatTabsModule, AddProductComponent, MatButtonModule, MatDialogModule, TranslatePipe ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  productList: Array<Product> = [];

  constructor(private homeService: HomeService, private alertService: AlertService,
    private loaderService: LoaderService, private popupService: PopupService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.loaderService.show();
    this.homeService.getProductData().subscribe({
      next: (data: Array<Product>) => {
        this.loaderService.hide();
        this.productList = [...data];
      },
      error: (err) => {
        this.loaderService.hide();
        console.log(err);
      }
    })
  }

  onProductAdded(event: any): void {
    this.getProducts();
  }

  deleteProductRow(product: Product): void {
    const data = {
      isDelete: true,
      isConfirmDialog: true,
      selectdItem: product
    }
    this.popupService.openDialog(data, '30rem', 'custom-dialog-container', () => {
      this.deleteProduct(product.id);
    });
   }

  deleteProduct(productId: string): void {
    this.loaderService.show();
    this.homeService.deleteProduct(productId).subscribe({
      next: (data) => {
        this.loaderService.hide();
        this.alertService.openSnackBar('Product deleted successfully!');
        this.getProducts();
      },
      error: (err) => {
        this.loaderService.hide();
        console.log(err);
      }
    })
  }


  upateProduct(product: Product): void {
    const dialogRef = this.dialog.open(AddProductComponent, {
      panelClass: 'custom-dialog-container',
      width: '60vw',
      height: '39rem',
      maxWidth: '100vw',
      data: product,
      disableClose: true,
      enterAnimationDuration: '100',
      exitAnimationDuration: '100',
    });

    dialogRef.afterClosed().subscribe((isUpdate: boolean) => {
      if (isUpdate)
        this.getProducts();
    });
  }
}
