import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Auth} from '../../services/auth';
import {Router, RouterLink} from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  router = inject(Router);
  _auth: Auth = inject(Auth)

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required,Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched()
      return
    }
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    const user = this._auth.users.find(e => e.email === email && e.password === password);
    if (user) {
      this._auth.login(user);
      this.router.navigate(['/']);
    } else {
      console.log("not logged in")
    }
  }
}
