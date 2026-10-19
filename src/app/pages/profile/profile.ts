import {Component, inject, OnInit} from '@angular/core';
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
export class Profile implements OnInit {
  router = inject(Router);
  _auth = inject(Auth);

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
    const userGet = localStorage.getItem('user')

    if (userGet) {
      const userParse = JSON.parse(userGet);
      this.user = userParse;
      this.newUser.patchValue({
        firstName: userParse.firstName || userParse.name?.split(' ')[0] || '',
        lastName: userParse.lastName || userParse.name?.split(' ')[1] || '',
        email: this.user.email,
        phone: this.user.phone,
      })
    }


  }

  passwordError = '';
  user = JSON.parse(localStorage.getItem('user')!);


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
      ...this.newUser.getRawValue(),
    };
    localStorage.setItem('user', JSON.stringify(this.user));
  }
}
