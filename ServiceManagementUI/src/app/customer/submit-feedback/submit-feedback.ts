import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CustomerService } from '../services/customer.service';
import { NotifyService } from '../../core/services/notify.service';

@Component({
  selector: 'app-submit-feedback',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  template: `
    <div class="feedback-container">
      <mat-card>
        <mat-card-header>
          <mat-icon mat-card-avatar>rate_review</mat-icon>
          <mat-card-title>Submit Feedback</mat-card-title>
          <mat-card-subtitle>Rate your service experience</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="feedbackForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Completed Service Request</mat-label>
              <mat-select formControlName="requestId">
                <mat-option *ngFor="let request of completedRequests" [value]="request.requestId">
                  #{{request.requestId}} - {{request.service?.serviceName}}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Rating</mat-label>
              <mat-select formControlName="rating">
                <mat-option value="5">⭐⭐⭐⭐⭐ Excellent (5)</mat-option>
                <mat-option value="4">⭐⭐⭐⭐ Good (4)</mat-option>
                <mat-option value="3">⭐⭐⭐ Average (3)</mat-option>
                <mat-option value="2">⭐⭐ Poor (2)</mat-option>
                <mat-option value="1">⭐ Very Poor (1)</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Comments</mat-label>
              <textarea matInput formControlName="comments" rows="4" 
                        placeholder="Share your experience with the service"></textarea>
            </mat-form-field>

            <mat-card-actions>
              <button mat-raised-button color="primary" type="submit" [disabled]="!feedbackForm.valid || loading">
                <mat-icon *ngIf="loading">hourglass_empty</mat-icon>
                <mat-icon *ngIf="!loading">send</mat-icon>
                {{ loading ? 'Submitting...' : 'Submit Feedback' }}
              </button>
              <button mat-button type="button" (click)="resetForm()">Reset</button>
            </mat-card-actions>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .feedback-container { padding: 20px; max-width: 600px; margin: 0 auto; }
    .full-width { width: 100%; margin-bottom: 16px; }
  `]
})
export class SubmitFeedback implements OnInit {
  feedbackForm: FormGroup;
  completedRequests: any[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private notify: NotifyService
  ) {
    this.feedbackForm = this.fb.group({
      requestId: ['', Validators.required],
      rating: ['', Validators.required],
      comments: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCompletedRequests();
  }

  loadCompletedRequests(): void {
  this.customerService.getMyRequests().subscribe({
    next: (requests: any[]) => {
      this.completedRequests = requests.filter(r => r.status === 'Completed');
    },
    error: () => this.notify.error('Failed to load completed requests')
  });
}

  onSubmit(): void {
    if (this.feedbackForm.valid) {
      this.loading = true;
      this.customerService.submitFeedback(this.feedbackForm.value).subscribe({
        next: () => {
          this.notify.success('Feedback submitted successfully!');
          this.resetForm();
          this.loading = false;
        },
        error: () => {
          this.notify.error('Failed to submit feedback');
          this.loading = false;
        }
      });
    }
  }

  resetForm(): void {
    this.feedbackForm.reset();
  }
}
