import { inject, Injectable } from '@angular/core';
import { DialogComponent } from '../../component/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  readonly dialog = inject(MatDialog);
  constructor() { }

    openDialog(data: any, width: string, panelClass: string, callback?: Function): void {
      const dialog = this.dialog.open(DialogComponent, {
        data: data,
        width: width,
        panelClass: panelClass,
        disableClose: true,
        enterAnimationDuration: '100',
        exitAnimationDuration: '100',
      });


      dialog.afterClosed().subscribe((data: any) => {
        if (callback && data) {
          callback(true);
        }
      })
    }

}
