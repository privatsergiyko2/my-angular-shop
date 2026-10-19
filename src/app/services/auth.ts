import { inject, Injectable } from '@angular/core';
import { Register } from '../pages/register/register';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { IUser } from '../models/IUser';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  users: IUser[] = [];
  userSubject: BehaviorSubject<IUser | null> = new BehaviorSubject<IUser | null>(null);
  isAdmin$: Observable<boolean> = this.userSubject.pipe(map((user: IUser | null) => user?.role === 1));

  constructor() {
    this.getAllRegisteredUsers();
    this.getAuthenticatedUser();
  }

  getAllRegisteredUsers() {
    const savedUsers: string | null = localStorage.getItem('users');

    this.users = JSON.parse(savedUsers ?? '[]') || [];
  }

  getAuthenticatedUser() {
    const user: IUser | null = JSON.parse(localStorage.getItem('user')!);
    this.userSubject.next(user);
  }

  login(user: IUser) {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  register(name: string, password: string, email: string) {
    const user: IUser = {
      name: name,
      password: password,
      email: email,
      role: 2,
    };

    this.users.push(user);
    localStorage.setItem('users', JSON.stringify(this.users));
  }
}
