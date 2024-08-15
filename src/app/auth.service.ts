import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly password: string = 'password';
  private authenticated: boolean = false;

  constructor(private router: Router) { }

  login(inputPassword: string): boolean {
    if (inputPassword == this.password) {
      this.authenticated = true;
      this.router.navigate(['calendar']);
      return true;
    }
    return false;
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

}
