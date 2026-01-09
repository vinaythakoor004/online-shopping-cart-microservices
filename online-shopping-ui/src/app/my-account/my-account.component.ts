import { Component, inject, OnInit } from '@angular/core';
import { UserService } from './service/user.service';
import { User } from '../model/user';
import { TranslatePipe } from '@ngx-translate/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddAddressComponent } from './add-address/add-address.component';

@Component({
  selector: 'app-my-account',
  imports: [ MatDialogModule, TranslatePipe ],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css',
})
export class MyAccountComponent implements OnInit {
  profile: User | null = null;
  readonly dialog = inject(MatDialog);

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.profile = this.userService.userProfile();
  }

  addOrUpdateAddress(): void {
        const dialogRef = this.dialog.open(AddAddressComponent, {
          panelClass: 'custom-dialog-container',
          width: '60vw',
          height: '39rem',
          maxWidth: '100vw',
          data: this.profile,
          disableClose: true,
          enterAnimationDuration: '100',
          exitAnimationDuration: '100',
        });

        dialogRef.afterClosed().subscribe((isUpdate: boolean) => {
          // if (isUpdate)
          //   this.getProducts();
        });
  }

}
