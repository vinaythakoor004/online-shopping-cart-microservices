import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { HomeService } from '../../home/service/home.service';
import { AlertService } from '../../common/services/alert/alert.service';

@Component({
  selector: 'app-add-product',
  imports: [ReactiveFormsModule, CommonModule, TranslatePipe],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent {
  @Output() productAdded = new EventEmitter<void>();
  productsForm: FormGroup;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private homeService: HomeService,
    private alertService: AlertService) {
    this.productsForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      skuCode: ['', Validators.required],
      price: ['', Validators.required]
    });
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
          this.productAdded.emit(data);
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
