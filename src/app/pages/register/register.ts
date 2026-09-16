import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Validators} from '@angular/forms';
import {minLength} from '@angular/forms/signals';
import { AbstractControl } from '@angular/forms';
import {Auth} from '../../services/auth';


@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  _auth: Auth = inject(Auth);


  registerForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
  }, this.passwordMatchValidator);
  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { name, password, email } = this.registerForm.getRawValue();

    this._auth.register(name as string, password as string, email as string);

    console.log(this.registerForm.value);
  }


  passwordMatchValidator(form: AbstractControl) {
   const password =  form.get("password")?.value
    const confirmPassword = form.get("confirmPassword")?.value
    if(confirmPassword === password){
      return null;
    } else {
      return { passwordMismatch: true }
    }
  }


  protected readonly minLength = minLength;
}
