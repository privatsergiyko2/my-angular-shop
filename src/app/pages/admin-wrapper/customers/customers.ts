import {ChangeDetectorRef, Component, inject, signal} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {Table} from "../../../components/table/table";
import {ProductsService} from '../../../services/products';
import {Product} from '../../../models/product';
import {IUser} from '../../../models/IUser';
import { AdminSidebar } from '../../../components/admin-sidebar/admin-sidebar';

@Component({
  selector: 'app-customers',
  imports: [RouterLink, RouterLinkActive, Table, AdminSidebar],
  templateUrl: './customers.html',
  styleUrl: './customers.scss',
})
export class Customers {
  users: IUser[] = JSON.parse(localStorage.getItem('users')!);
  menuOpen: string | null = null;
  selectedUser: IUser | undefined = undefined;
  message = '';

  deleteUser(email: string) {
    this.users = this.users.filter((user) => user.email !== email);
    localStorage.setItem('users', JSON.stringify(this.users));
    this.message = 'Customer deleted successfully';
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  viewUser(email: string) {
    this.selectedUser = this.users.find((user) => user.email === email);
  }

  closeModal() {
    this.selectedUser = undefined;
  }
}
