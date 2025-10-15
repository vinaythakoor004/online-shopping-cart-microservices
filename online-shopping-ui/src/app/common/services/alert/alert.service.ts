import { inject, Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AlertComponent } from '../../component/alert/alert.component';

@Injectable({
  providedIn: 'root'
})
export class AlertService {


  constructor() { }

  private _snackBar = inject(MatSnackBar);

  durationInSeconds = 4;

  openSnackBar(msg: string) {
    this._snackBar.openFromComponent(AlertComponent, {
      data: {
        message: msg
      },
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: 'alertClass',
    });
  }
}
