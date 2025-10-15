import { Component, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {
  data: any = inject(MAT_SNACK_BAR_DATA);

  constructor() { }
  ngOnInit(): void {
    console.log("Alert component initialized");
  }
}
