import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../services/loader/loader.service';

@Component({
  selector: 'app-loader',
  imports: [ CommonModule, MatProgressSpinnerModule ],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent implements OnInit {
  isLoading$: Observable<boolean> = of(false);
  isGloabalLoading$: Observable<boolean> = of(false);
  constructor(private loaderService: LoaderService) {}

  ngOnInit(): void {
    this.isLoading$ = this.loaderService.getLoadingStatus();
    this.isGloabalLoading$ = this.loaderService.getGloabalLoadingStatus();
  }
}
