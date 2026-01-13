import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { Address, User } from '../../model/user';
import { LoaderService } from '../../common/services/loader/loader.service';
import { UserService } from '../service/user.service';

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

  constructor(private fb: FormBuilder, private loaderService: LoaderService, private userService: UserService) {
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

  onSubmit() {
    if (this.addressForm.valid) {
      this.addressForm.get('isDefault')?.setValue(this.addressForm.get('isDefault')?.value === 'true');
      console.log(this.addressForm.value);
      this.loaderService.show();
      this.addAddress(this.addressForm.value);
      this.addressForm.reset();
    }
   }

  addAddress(addressData: Address): void {
    this.userService.addAddress(addressData).subscribe({
      next: (response) => {
        this.loaderService.hide();
        this.userService.userProfile()?.addresses.push(response);
        this.dialogRef?.close(true);
      },
      error: (error) => {
        this.loaderService.hide();
      }
    })
  }

  closeDialog(): void {
    this.dialogRef?.close(false);
  }
}
