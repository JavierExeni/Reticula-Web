import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthResponse } from 'src/app/shared/models/usuario';
import { AuthService } from '../../auth.service';
import { Login } from '../../../shared/models/usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit {
  hasError: boolean = false;

  formLogin: FormGroup = this.fb.group({
    username: ['', Validators.required],
    spassword: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  login() {
    let { username, spassword } = this.formLogin.value;
    const body: Login = { username, spassword };

    this.authService.login(body).subscribe(
      ({ res, data }: AuthResponse) => {
        if (res === 'success') {
          this.router.navigate(['/menu']);
        } else {
          this.hasError = false;
        }
      },
      (err) => console.log
    );
  }
}
