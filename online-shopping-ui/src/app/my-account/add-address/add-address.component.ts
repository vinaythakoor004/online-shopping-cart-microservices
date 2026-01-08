import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { User } from '../../model/user';

@Component({
  selector: 'app-add-address',
  imports: [ ReactiveFormsModule, CommonModule, TranslatePipe, MatDialogModule ],
  templateUrl: './add-address.component.html',
  styleUrl: './add-address.component.css',
})
export class AddAddressComponent {
  dialogRef = inject(MatDialogRef<AddAddressComponent>, { optional: true });
  readonly data = inject<User | null>(MAT_DIALOG_DATA, { optional: true });
  isEditMode: boolean = false;
  addressForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addressForm = this.fb.group({
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      pinCode: ['', Validators.required],
      isDefault: [false],
    })
  }

  onSubmit() {  }

  closeDialog(): void {
    this.dialogRef?.close(false);
  }
}
