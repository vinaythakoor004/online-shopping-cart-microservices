import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

private isLoading = new BehaviorSubject<boolean>(false);

  show(): void {
    this.isLoading.next(true);
  }

  hide(): void {
    this.isLoading.next(false);
  }

  getLoadingStatus(): Observable<boolean> {
    return this.isLoading.asObservable();
  }
}
