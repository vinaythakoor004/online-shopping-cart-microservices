import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { HomeService } from '../home/service/home.service';
import { AlertService } from '../common/services/alert/alert.service';

@Component({
  selector: 'app-admin',
  imports: [ ReactiveFormsModule, CommonModule, TranslatePipe ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  productsForm: FormGroup;

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

  onSubmit(): void {
    if (this.productsForm.valid) {
      this.homeService.saveProductData(this.productsForm.value).subscribe({
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
