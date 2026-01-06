import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { NotifyService } from '../../core/services/notify.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notify: NotifyService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Update the login component's onSubmit method
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.loading = false; // Move this here
          console.log('Login response:', response);
          this.notify.success('Login successful');
          const role = response.user.role.roleName;
          console.log('User role:', role);
          this.redirectByRole(role);
        },
        error: (error) => {
          this.loading = false;
          console.error('Login error:', error);

          // Extract the error message from the backend response
          let errorMessage = 'Backend server is not running or unreachable';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }

          this.notify.error(errorMessage);
        }
      });
    }
  }

  // In login.ts, change admin redirect temporarily
  private redirectByRole(role: string): void {
    const routes: { [key: string]: string } = {
      'Admin': '/admin/users',
      'ServiceManager': '/manager/service-requests',
      'Technician': '/technician/tasks',
      'Customer': '/customer/dashboard'
    };

    console.log('Redirecting role:', role, 'to:', routes[role]);
    this.router.navigate([routes[role] || '/auth/login']);
  }



}

