import { Component, inject, OnInit } from '@angular/core';
import { UserService } from './service/user.service';
import { Address, User } from '../model/user';
import { TranslatePipe } from '@ngx-translate/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddAddressComponent } from './add-address/add-address.component';
import { LoaderService } from '../common/services/loader/loader.service';
import { AlertService } from '../common/services/alert/alert.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-account',
  imports: [ MatDialogModule, TranslatePipe, FormsModule ],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css',
})
export class MyAccountComponent implements OnInit {
  profile: User;
  readonly dialog = inject(MatDialog);
  isMobileEditView: boolean = false;
  isGenderEditView: boolean = false;

  constructor(private userService: UserService, private loaderService: LoaderService, private alertService: AlertService) {
    this.profile = this.userService.setEmptyProfile();
  }

  ngOnInit(): void {
    this.profile = this.userService.getProfile();
  }

  addOrUpdateAddress(isUpdate: boolean, address: Address | null): void {
        const dialogRef = this.dialog.open(AddAddressComponent, {
          panelClass: 'custom-dialog-container',
          width: '60vw',
          // height: '38rem',
          maxWidth: '100vw',
          data: {profile: this.profile, isUpdate, address},
          disableClose: true,
          enterAnimationDuration: '100',
          exitAnimationDuration: '100',
        });

        dialogRef.afterClosed().subscribe((isUpdate: boolean) => {
          // if (isUpdate)
          //   this.getProducts();
        });
  }

  deleteAddress(address: Address): void {
    this.loaderService.show();
    this.userService.deleteAddress(address.id).subscribe({
      next: (response) => {
        this.loaderService.hide();
        this.alertService.openSnackBar('Address deleted successfully.');
        if (this.profile && address) {
          const index = this.profile.addresses.findIndex((addr) => addr.id === address.id);
          if (index !== -1) {
            this.profile.addresses.splice(index, 1);
          }
        }
      },
      error: (error) => {
        this.loaderService.hide();
        this.alertService.openSnackBar('Error occurred while deleting address. Please try again.');
      }
    });
  }

  updateUserData(user: User): void {
    this.userService.updateUserData(user).subscribe({
      next: (response) => {
        this.alertService.openSnackBar('User data updated successfully.');
        this.userService.setProfile(response);
        this.profile = this.userService.getProfile();
        this.isMobileEditView = false;
        this.isGenderEditView = false;
      },
      error: (error) => {
        this.alertService.openSnackBar('Error occurred while updating user data. Please try again.');
      }
    });
  }

  showUpdateView(field: string): void {
    if (field === 'mobile') {
      this.isMobileEditView = true;
    } else if (field === 'gender') {
      this.isGenderEditView = true;
    }
  }
}
