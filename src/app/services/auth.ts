import {inject, Injectable} from '@angular/core';
import {Register} from '../pages/register/register';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {IUser} from '../models/IUser';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
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
    return this.http.post("http://localhost:3000/auth/register", {
      name: name,
      password: password,
      email: email,
    })
  }
}
