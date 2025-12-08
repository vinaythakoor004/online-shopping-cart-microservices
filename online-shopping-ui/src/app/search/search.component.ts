import { Component, EventEmitter, Input, output, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { product } from '../model/product';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  @Input() productData: Array<product> = [];
  @Output() searchEvent = new EventEmitter<any>();
  private searchSubject = new Subject<string>();
  allProductDataCopy: Array<product> = [];
  _allProductData: Array<product> = [];

  @Input()
  set allProductData(set: Array<product>) {
    this._allProductData = set;
    if (!this.allProductDataCopy.length) {
      this.allProductDataCopy = structuredClone(set);
    }
  }

  get allProductData(): any {
    console.log(this._allProductData);
    return this._allProductData;
  }

  ngOnInit() {
    this.searchSubject.pipe(
    debounceTime(600),
    distinctUntilChanged(),
    filter(value => !value || value.length >= 3) // allow empty or 3+ chars
  ).subscribe(search => {
    this.searchEvent.emit({ search }); // emit only after debounce + filter
  });
  }

  onInput(e: any): void {
    const val = e?.target?.value || e?.value || "";
    this.searchSubject.next(val.trim());
  }

  searchClicked(e: any): void {
    const element = document?.getElementById('searchBox');
    this.onInput(element);
  }
}
