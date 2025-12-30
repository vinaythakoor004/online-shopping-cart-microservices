import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, inject, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { HomeService } from '../../home/service/home.service';
import { AlertService } from '../../common/services/alert/alert.service';
import { Product } from '../../common/model/product.model';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { LoaderService } from '../../common/services/loader/loader.service';

@Component({
  selector: 'app-add-product',
  imports: [ReactiveFormsModule, CommonModule, TranslatePipe, MatDialogModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent implements OnInit   {
  dialogRef = inject(MatDialogRef<AddProductComponent>, { optional: true });
  readonly data = inject<Product | null>(MAT_DIALOG_DATA, { optional: true });
  @Output() productAdded = new EventEmitter<void>();
  isEditDialog = computed(() => !!this.dialogRef);

  productsForm: FormGroup;
  productBulkForm: FormGroup;
  selectedFile: File | null = null;
  fileName: string | null = null;
  selectedCsvFile: File | null = null;
  csvFileName: string | null = null;
  selectedZipFile: File | null = null;
  zipFileName: string | null = null;

  constructor(private fb: FormBuilder, private homeService: HomeService,
    private alertService: AlertService, private loaderService: LoaderService) {
    this.productsForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      skuCode: ['', Validators.required],
      price: ['', Validators.required]
    });

    this.productBulkForm = this.fb.group({
      csvFile: [null, Validators.required],
      zipFile: [null, Validators.required]
    })
  }

  ngOnInit(): void {
    this.productsForm.patchValue({
      name: this.data?.name || '',
      description: this.data?.description || '',
      skuCode: this.data?.skuCode || '',
      price: this.data?.price || ''
    });

    if (this.data) {
      this.fileName = this.data.name;
    }
  }

  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;

    if (file) {
      this.selectedFile = file;
      this.fileName = file.name;
    }
  }

  onCsv(event: any): void {
    this.selectedCsvFile = event.target.files[0];
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;

    if (file) {
      this.selectedCsvFile = file;
      this.csvFileName = file.name;
    }
  }

  onZip(event: any): void {
    this.selectedZipFile = event.target.files[0];
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;

    if (file) {
      this.selectedZipFile = file;
      this.zipFileName = file.name;
    }
  }

  onSubmit(): void {
    if (this.productsForm.valid) {

      if (!this.selectedFile && !this.isEditDialog()) {
        alert("Please select an image file");
        return;
      }

      const formData = new FormData();
      const productJson = JSON.stringify(this.productsForm.value);

      formData.append(
        "product",
        new Blob([productJson], { type: "application/json" })
      );

      if (this.selectedFile) {
        formData.append("file", this.selectedFile);
      }

      this.loaderService.show();
      if (this.isEditDialog() && this.data) {
        this.updateProduct(this.data.id!, formData);
      } else {
        this.addProduct(formData);
      }
    } else {
      console.log('Form is invalid.');
    }
  }

  addProduct(formData: FormData): void {
    this.homeService.addProductDetails(formData).subscribe({
      next: (data) => {
        this.alertService.openSnackBar('Product data added successfully!');
        this.productAdded.emit(data);
        this.loaderService.hide();
        this.productsForm.reset();
      },
      error: (err) => {
        this.loaderService.hide();
        console.log(err);
      }
    })
  }

  updateProduct(productId: string, formData: FormData): void {
    this.homeService.updateProductDetails(productId, formData).subscribe({
      next: (data) => {
        this.alertService.openSnackBar('Product data updated successfully!');
        this.dialogRef?.close();
        this.loaderService.hide();
        this.productAdded.emit(data);
        this.productsForm.reset();
      },
      error: (err) => {
        this.loaderService.hide();
        console.log(err);
      }
    })
  }

  onBulkUploadSubmit(): void {
      if (!this.selectedCsvFile) {
        alert("Please select csv file");
        return;
      } else if (!this.selectedZipFile) {
        alert("Please select zip file");
        return;
      }

      const formData = new FormData();

      if (this.selectedCsvFile) {
        formData.append("file", this.selectedCsvFile);
      }

      if (this.selectedZipFile) {
        formData.append("imagesZip", this.selectedZipFile);
      }

      this.loaderService.show();
      this.bulkUpload(formData);
  }

    bulkUpload(formData: FormData): void {
    this.homeService.bulkUploadProducts(formData).subscribe({
      next: (data) => {
        this.alertService.openSnackBar('Product data added successfully!');
        this.productAdded.emit(data);
        this.loaderService.hide();
        this.productBulkForm.reset();
      },
      error: (err) => {
        this.loaderService.hide();
        console.log(err);
      }
    })
  }
}
