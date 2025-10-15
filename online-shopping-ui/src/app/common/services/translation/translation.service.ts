import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  constructor(private translateService: TranslateService) {}
  get(key: string): string {
    let retValue: string = key;
    if (typeof key === 'string') {
      this.translateService.get(key).subscribe((value) => {
        retValue = value;
      });
    }

    return retValue;
  }
}
