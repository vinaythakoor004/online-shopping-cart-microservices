import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HomeService } from './service/home.service';
import { CommonModule } from '@angular/common';
import { Product } from '../common/model/product.model';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-home',
  imports: [ MatProgressSpinnerModule, CommonModule, MatCardModule ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  isLoading: boolean = false;
  productList: Array<Product> = [];
  constructor(private homeService: HomeService) { }

  ngOnInit(): void {
    this.homeService.getProductData().subscribe({
      next: (data: Array<Product>) => {
        this.productList = data;
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

}
