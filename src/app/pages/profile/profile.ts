import { Component, inject, OnInit, signal } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Auth} from '../../services/auth';
import {Router} from '@angular/router';
import {RouterLink} from '@angular/router';
import {Users} from '../../services/users';
import {UserProfile} from '../../models/user-profile';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  router = inject(Router);
  _auth = inject(Auth);
  _users = inject(Users);
  user = signal<UserProfile | null>(null);


  newUser = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl({value: "", disabled: true}),
    phone: new FormControl(''),
  });

  password = new FormGroup(
    {
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    },
    this.passwordMatchValidator,
  );

  ngOnInit() {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token not found');
      return;
    }

    this._users.getProfile(token).subscribe({
      next: (user) => {
        console.log('Profile from MongoDB:', user);

        const nameParts = user.name.trim().split(/\s+/);

        this.newUser.patchValue({
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' '),
          email: user.email,
          phone: user.phone || '',
        });
        this.user.set(user);
      },
      error: (error) => {
        console.error('Failed to load profile:', error);
      },
    });
  }


  // const userGet = localStorage.getItem('user')
  //
  //
  // if (userGet) {
  //   const userParse = JSON.parse(userGet);
  //   this.user = userParse;
  //   this.newUser.patchValue({
  //     firstName: userParse.firstName || userParse.name?.split(' ')[0] || '',
  //     lastName: userParse.lastName || userParse.name?.split(' ')[1] || '',
  //     email: this.user.email,
  //     phone: this.user.phone,
  //   })
  // }


  passwordError = '';
  passwordSuccess = '';



  passwordMatchValidator(form: AbstractControl) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    if (newPassword?.value === confirmPassword?.value) {
      return null;
    } else {
      return {passwordMismatch: true};
    }
  }


  savePassword() {

    console.log('savePassword called');
    console.log('Form valid:', this.password.valid);
    console.log('Form errors:', this.password.errors);

    console.log('Form values:', {
      currentPasswordFilled: !!this.password.get('currentPassword')?.value,
      newPasswordLength: this.password.get('newPassword')?.value?.length,
      confirmPasswordLength: this.password.get('confirmPassword')?.value?.length,
    });

    if (this.password.invalid) {
      this.password.markAllAsTouched();
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token not found');
      return;
    }

    const currentPassword = this.password.get('currentPassword')?.value || '';
    const newPassword = this.password.get('newPassword')?.value || '';

    this.passwordError = '';
    this.passwordSuccess = '';
    this._users.changePassword(token, newPassword, currentPassword).subscribe({
      next: (response) => {
        this.passwordSuccess = response.message;
        this.passwordError = '';
        this.password.reset();
      },
      error: (error) => {
        console.error('Failed to change password:', error);

        if (error.status === 401) {
          this.passwordError = 'Current password is incorrect';
        }
      },
    });
  }


  logout() {
    this._auth.logout();
    this.router.navigate(['/login']);
  }

  save() {
    if (this.newUser.invalid) {
      this.newUser.markAllAsTouched();
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token not found');
      return;
    }

    const firstName = this.newUser.get('firstName')?.value || '';
    const lastName = this.newUser.get('lastName')?.value || '';
    const phone = this.newUser.get('phone')?.value || '';

    const name = `${firstName.trim()} ${lastName.trim()}`.trim();

    this._users.updateProfile(token, name, phone).subscribe({
      next: (user) => {
        this.user.set(user);
        console.log('Profile updated:', user);
      },
      error: (error) => {
        console.error('Failed to update profile:', error);
      },
    });
  }
}
