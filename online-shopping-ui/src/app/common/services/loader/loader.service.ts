import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

private isLoading = new BehaviorSubject<boolean>(false);
private isGloabalLoading = new BehaviorSubject<boolean>(false);

  show(): void {
    this.isLoading.next(true);
  }

  hide(): void {
    this.isLoading.next(false);
  }

  getLoadingStatus(): Observable<boolean> {
    return this.isLoading.asObservable();
  }

  globalLoaderShow(): void {
    this.isGloabalLoading.next(true);
  }

  globalLoaderHide(): void {
    this.isGloabalLoading.next(false);
  }

  getGloabalLoadingStatus(): Observable<boolean> {
    return this.isGloabalLoading.asObservable();
  }
}
