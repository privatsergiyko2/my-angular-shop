import {inject, Injectable} from '@angular/core';
import {Register} from '../pages/register/register';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  users: {
    name: string,
    password: string,
    email: string;
  }[] = []

  userSubject = new BehaviorSubject<string | null>(localStorage.getItem('user'));

  constructor() {
   const saveUsers =  localStorage.getItem('users')

    if(saveUsers != null){
    this.users = JSON.parse(saveUsers);
    localStorage.setItem('users', JSON.stringify(this.users))
    }
  }

  login(user: { name: string; password: string; email: string }) {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(JSON.stringify(user));
  }

  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  register(name: string, password: string, email: string) {
    const user = {
      name: name,
      password: password,
      email: email,
    }

    this.users.push(user);
    localStorage.setItem('users', JSON.stringify(this.users))
  }
}
