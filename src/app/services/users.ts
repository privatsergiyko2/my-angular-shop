import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserProfile} from '../models/user-profile';


@Injectable({
  providedIn: 'root',
})
export class Users {
  http = inject(HttpClient);


  getProfile(token: string) {
    return this.http.get<UserProfile>('http://localhost:3000/users/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  updateProfile(token: string, name: string, phone: string) {
    return this.http.patch<UserProfile>(
      'http://localhost:3000/users/me',
      {name, phone},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  changePassword(token: string, newPassword: string, currentPassword: string) {
    return this.http.patch<{message: string}>('http://localhost:3000/users/me/password', {
      currentPassword: currentPassword,
      newPassword: newPassword
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })

  }

}
