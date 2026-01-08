import { Injectable, signal } from '@angular/core';
import { User } from '../../model/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
    userProfile = signal<User | null>(null);

    constructor() {}

    setProfile(profile: any) {
      return this.userProfile.set(profile);
    }

    getProfile() {
      return this.userProfile();
    }
}
