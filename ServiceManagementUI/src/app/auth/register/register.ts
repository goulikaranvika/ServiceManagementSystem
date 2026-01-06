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
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  registerForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notify: NotifyService
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', [Validators.pattern(/^\d{10}$/)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      const userData = this.registerForm.value;
      
      this.authService.register(userData).subscribe({
        next: () => {
          this.notify.success('Registration successful! Please login.');
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.notify.error(error.error?.message || 'Registration failed');
          this.loading = false;
        }
      });
    }
  }
}


