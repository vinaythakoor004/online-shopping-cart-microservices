import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { Address, User } from '../../model/user';
import { LoaderService } from '../../common/services/loader/loader.service';
import { UserService } from '../service/user.service';
import { AlertService } from '../../common/services/alert/alert.service';

@Component({
  selector: 'app-add-address',
  imports: [ ReactiveFormsModule, CommonModule, TranslatePipe, MatDialogModule ],
  templateUrl: './add-address.component.html',
  styleUrl: './add-address.component.css',
})
export class AddAddressComponent {
  dialogRef = inject(MatDialogRef<AddAddressComponent>, { optional: true });
  readonly data = inject<any>(MAT_DIALOG_DATA, { optional: true });
  isEditMode: boolean = false;
  addressForm: FormGroup;

  constructor(private fb: FormBuilder, private loaderService: LoaderService,
    private userService: UserService, private alertService: AlertService) {
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

  ngOnInit(): void {
    this.isEditMode = this.data?.isUpdate || false;
    if (this.isEditMode && this.data?.address) {
      this.updateFormForEditMode(this.data.address);
    }
  }

  updateFormForEditMode(addressData: Address): void {
    this.addressForm.patchValue({
      addressLine1: addressData.addressLine1 || '',
      addressLine2: addressData.addressLine2 || '',
      city: addressData.city || '',
      country: addressData.country || '',
      state: addressData.state || '',
      pinCode: addressData.pinCode || '',
      isDefault: addressData.isDefault ? 'true' : 'false'
    });
  }

  onSubmit() {
    if (this.addressForm.valid) {
      this.addressForm.get('isDefault')?.setValue(this.addressForm.get('isDefault')?.value === 'true');
      console.log(this.addressForm.value);
      this.loaderService.show();
      if (this.isEditMode) {
        this.updateAddress(this.addressForm.value);
      } else {
        this.addAddress(this.addressForm.value);
      }
      this.addressForm.reset();
    }
   }

  addAddress(addressData: Address): void {
    this.userService.addAddress(addressData).subscribe({
      next: (response) => {
        this.loaderService.hide();
        this.userService.userProfile()?.addresses.push(response);
        this.dialogRef?.close(true);
        this.alertService.openSnackBar('Address added successfully.');
      },
      error: (error) => {
        this.loaderService.hide();
        this.alertService.openSnackBar('Error occurred while adding address. Please try again.');
      }
    })
  }

  updateAddress(address: Address): void {
  this.userService.updateAddress(this.data?.address?.id, address).subscribe({
      next: (response) => {
        this.loaderService.hide();
        this.dialogRef?.close(true);
        this.alertService.openSnackBar('Address updated successfully.');
        this.mapUserAddressData(response);
      },
      error: (error) => {
        this.alertService.openSnackBar('Error occurred while updating address. Please try again.');
        this.loaderService.hide();
      }
  });
  }

  closeDialog(): void {
    this.dialogRef?.close(false);
  }

  mapUserAddressData(address: Address): void {
    let userProfile: User | null = this.userService.userProfile();
    if (userProfile && this.isEditMode && address) {
      const index = userProfile.addresses.findIndex((addr) => addr.id === address.id);
      if (index !== -1) {
        userProfile.addresses[index] = { ...this.data.address, ...address };
      }
    }
  }
}
