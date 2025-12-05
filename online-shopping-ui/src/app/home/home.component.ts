import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HomeService } from './service/home.service';

@Component({
  selector: 'app-home',
  imports: [ MatProgressSpinnerModule ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  constructor(private homeService: HomeService) { }

  ngOnInit(): void {
    this.homeService.getProductData().subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

}
