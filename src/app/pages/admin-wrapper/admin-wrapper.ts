import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminSidebar } from '../../components/admin-sidebar/admin-sidebar';

@Component({
  selector: 'app-admin-wrapper',
  imports: [RouterOutlet, AdminSidebar],
  templateUrl: './admin-wrapper.html',
  styleUrl: './admin-wrapper.scss',
})
export class AdminWrapper {}
