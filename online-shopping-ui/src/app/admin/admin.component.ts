import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { HomeService } from '../home/service/home.service';
import { AlertService } from '../common/services/alert/alert.service';
import {MatTabsModule} from '@angular/material/tabs';
import { Product } from '../common/model/product.model';

export interface adminTab {
  label: string;
  content: string;
}

@Component({
  selector: 'app-admin',
  imports: [ ReactiveFormsModule, CommonModule, TranslatePipe, MatTabsModule ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  productsForm: FormGroup;
  selectedFile: File | null = null;
  productList: Array<Product> = [];

  constructor(private fb: FormBuilder, private homeService: HomeService,
    private alertService: AlertService
  ) {
    this.productsForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      skuCode: ['', Validators.required],
      price: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.homeService.getProductData().subscribe({
      next: (data: Array<Product>) => {
        this.productList = data;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.productsForm.valid) {

    if (!this.selectedFile) {
      alert("Please select an image file");
      return;
    }

    const formData = new FormData();
    const productJson = JSON.stringify(this.productsForm.value);

    formData.append(
      "product",
      new Blob([productJson], { type: "application/json" })
    );

    formData.append("file", this.selectedFile);

    this.homeService.saveProductData(formData).subscribe({
      next: (data) => {
        this.alertService.openSnackBar('Data saved successfully!');
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      }
    })
    this.productsForm.reset();
    } else {
      console.log('Form is invalid.');
    }
  }
}
