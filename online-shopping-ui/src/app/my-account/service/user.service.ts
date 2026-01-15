import { Injectable, signal } from '@angular/core';
import { Address, User } from '../../model/user';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = '/api/user/me/addresses';
  userProfile = signal<User>(this.setEmptyProfile());
  profile: User;

  constructor(private http: HttpClient) {
    this.profile = this.setEmptyProfile();
  }

  setEmptyProfile(): User {
    let user = {
      firstName: '',
      lastName: '',
      email: '',
      gender: '',
      keycloakUserId: '',
      mobileNumber: '',
      addresses: []
    }

    return user;
  }

  mapUserProfileData(profile: User): User {
    this.profile.firstName = profile?.firstName;
    this.profile.lastName = profile.lastName;
    this.profile.email = profile.email;
    this.profile.addresses = profile.addresses || [];
    this.profile.gender = profile.gender || '';
    this.profile.keycloakUserId = profile.keycloakUserId || '';
    this.profile.mobileNumber = profile.mobileNumber || '';
    return this.profile;
  }

  setProfile(profile: any) {
    return this.userProfile.set(this.mapUserProfileData(profile));
  }

  getProfile() {
    return this.userProfile();
  }

  addAddress(address: Address): Observable<Address> {
    return this.http.post<Address>(this.apiUrl, address);
  }

  updateAddress(addressId: string, address: Address): Observable<Address> {
    const url = `${this.apiUrl}/${addressId}`;
    return this.http.put<Address>(url, address);
  }

  getAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(this.apiUrl);
  }

  deleteAddress(addressId: number): Observable<void> {
    const url = `${this.apiUrl}/${addressId}`;
    return this.http.delete<void>(url);
  }

  setDefaultAddress(addressId: number): Observable<void> {
    const url = `${this.apiUrl}/${addressId}/default`;
    return this.http.put<void>(url, {});
  }
}
