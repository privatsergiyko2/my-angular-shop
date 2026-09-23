import {Component, inject} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Auth} from '../../services/auth';
import {Router} from '@angular/router';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  router = inject(Router);
  _auth = inject(Auth);
  newUser = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  password = new FormGroup(
    {
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    },
    this.passwordMatchValidator,
  );

  passwordError = '';
  user = JSON.parse(localStorage.getItem('user')!);

  constructor() {
    this.newUser.patchValue({
      name: this.user.name,
      email: this.user.email,
    });
  }

  passwordMatchValidator(form: AbstractControl) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    if (newPassword?.value === confirmPassword?.value) {
      return null;
    } else {
      return { passwordMismatch: true };
    }
  }

  savePassword() {
    if (this.password.invalid) {
      this.password.markAllAsTouched();
      return;
    }
    if (this.password.get('currentPassword')?.value !== this.user.password) {
      this.passwordError = 'Current password is incorrect';
      return;
    }
    this.user.password = this.password.get('newPassword')?.value;
    localStorage.setItem('user', JSON.stringify(this.user));
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
    this.user = {
      ...this.user,
      ...this.newUser.value,
    };
    localStorage.setItem('user', JSON.stringify(this.user));
  }
}
