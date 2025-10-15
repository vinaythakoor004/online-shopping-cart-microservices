import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  isLoggedIn: boolean = false;
  loggedInUser: any = {};
  selectedPlan: any = {};
  constructor(private httpService: HttpService) {}

  getAllUsers(): Observable<any[]> {
    return this.httpService.get<any[]>('./assets/json/login_users.json').pipe(
      map((data: any) => {
        return data;
      })
    );
  }

  checkLoginDetails(data: any, userData: any): Observable<any> {
    let urlPart = '/login';
    return this.httpService.post(urlPart, data).pipe(() => {
      let isValid: boolean = false;
      for (let index = 0; index < userData.length; index++) {
        const element = userData[index];
        if (
          data.username == element.username &&
          data.password == element.password
        ) {
          this.loggedInUser = element;
          isValid = true;
          break;
        }
      }
      return of({
        isValid,
        userDetails: data,
      });
    });
  }

  getPlanDetails(): Observable<any> {
    return this.httpService.get('./assets/json/plans.json')
  }
}
