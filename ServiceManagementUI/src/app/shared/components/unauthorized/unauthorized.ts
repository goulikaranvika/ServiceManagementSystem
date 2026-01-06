import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="unauthorized-container">
      <mat-card class="unauthorized-card">
        <mat-card-content>
          <div class="content">
            <mat-icon class="error-icon">block</mat-icon>
            <h2>Access Denied</h2>
            <p>You don't have permission to access this page.</p>
            <button mat-raised-button color="primary" (click)="goBack()">
              Go Back
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .unauthorized-card { padding: 40px; text-align: center; }
    .error-icon { font-size: 72px; color: #f44336; }
    .content h2 { margin: 20px 0; }
  `]
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/']);
  }
}
