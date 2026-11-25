import {ChangeDetectorRef, Component, inject, OnInit, signal} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {Table} from "../../../components/table/table";
import {ProductsService} from '../../../services/products';
import {Product} from '../../../models/product';
import {IUser} from '../../../models/IUser';
import { AdminSidebar } from '../../../components/admin-sidebar/admin-sidebar';
import {Auth} from '../../../services/auth';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-customers',
  imports: [RouterLink, RouterLinkActive, Table, AdminSidebar],
  templateUrl: './customers.html',
  styleUrl: './customers.scss',
})
export class Customers implements OnInit {
  // users: IUser[] = JSON.parse(localStorage.getItem('users')!);
  // users: IUser[] = [];
  users = signal<IUser[]>([]);
  menuOpen: string | null = null;
  selectedUser: IUser | undefined = undefined;
  message = '';
  private authService = inject(Auth);


  ngOnInit() {
    this.authService.getAllUsers().subscribe({
      next: (users) => {
        console.log('USERS FROM BACKEND:', users);
        this.users.set(users);
      },
      error: (error) => {
        console.log('ERROR FROM BACKEND:', error);
      }
    });
  }

  // deleteUser(email: string) {
  //   this.users = this.users.filter((user) => user.email !== email);
  //   localStorage.setItem('users', JSON.stringify(this.users));
  //   this.message = 'Customer deleted successfully';
  //   setTimeout(() => {
  //     this.message = '';
  //   }, 3000);
  // }

  deleteUser(userId: string) {
    this.authService.deleteUser(userId).subscribe({
      next: () => {
        this.users.update(users =>
          users.filter(user => user._id !== userId)
        );
      },
      error: (error) => {
        console.error('Delete error:', error);
      }
    });
  }

  viewUser(email: string) {
    this.selectedUser = this.users().find((user) => user.email === email);
  }

  closeModal() {
    this.selectedUser = undefined;
  }
}
