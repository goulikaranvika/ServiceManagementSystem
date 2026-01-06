import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { TechnicianService } from '../services/technician.service';
import { NotifyService } from '../../core/services/notify.service';

@Component({
  selector: 'app-performance',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressBarModule, MatTableModule],
  template: `
    <div class="performance-container">
      <h2>My Performance Dashboard</h2>
      
      <div class="performance-cards">
        <mat-card class="perf-card">
          <mat-card-content>
            <div class="perf-content">
              <mat-icon class="perf-icon">assignment_turned_in</mat-icon>
              <div class="perf-text">
                <h3>{{performanceData.completedTasks || 0}}</h3>
                <p>Completed Tasks</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="perf-card">
          <mat-card-content>
            <div class="perf-content">
              <mat-icon class="perf-icon">pending</mat-icon>
              <div class="perf-text">
                <h3>{{performanceData.inProgressTasks || 0}}</h3>
                <p>In Progress Tasks</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="perf-card">
          <mat-card-content>
            <div class="perf-content">
              <mat-icon class="perf-icon">assignment</mat-icon>
              <div class="perf-text">
                <h3>{{performanceData.totalAssignedTasks || 0}}</h3>
                <p>Total Assigned</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="perf-card">
          <mat-card-content>
            <div class="perf-content">
              <mat-icon class="perf-icon">person</mat-icon>
              <div class="perf-text">
                <h3>{{performanceData.technicianName}}</h3>
                <p>Technician Details</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="perf-card">
          <mat-card-content>
            <div class="perf-content">
              <mat-icon class="perf-icon">star</mat-icon>
              <div class="perf-text">
                <h3>{{performanceData.averageRating}}/5</h3>
                <p>Average Rating</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="perf-card">
          <mat-card-content>
            <div class="perf-content">
              <mat-icon class="perf-icon">rule</mat-icon>
              <div class="perf-text">
                <h3>{{performanceData.slaCompliancePercentage}}%</h3>
                <p>SLA Compliance</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="perf-card">
          <mat-card-content>
            <div class="perf-content">
              <mat-icon class="perf-icon">timer</mat-icon>
              <div class="perf-text">
                <h3>{{performanceData.averageCompletionHours | number:'1.1-1'}}h</h3>
                <p>Avg Completion Time</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="feedback-section" *ngIf="recentFeedback.length > 0">
        <h3>Recent Customer Feedback</h3>
        <div class="feedback-grid">
          <mat-card *ngFor="let feedback of recentFeedback" class="feedback-card">
            <mat-card-header>
              <div mat-card-avatar class="feedback-avatar">
                <mat-icon>account_circle</mat-icon>
              </div>
              <mat-card-title>{{feedback.customerName}}</mat-card-title>
              <mat-card-subtitle>{{feedback.serviceName}} • {{feedback.createdAt | date}}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="rating-display">
                <mat-icon *ngFor="let star of getStars(feedback.rating)" class="star">star</mat-icon>
                <span class="rating-num">({{feedback.rating}}/5)</span>
              </div>
              <p class="comments">"{{feedback.comments}}"</p>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <div class="no-feedback" *ngIf="recentFeedback.length === 0">
        <mat-card>
          <mat-card-content>
            <p>No customer feedback received yet.</p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .performance-container { padding: 20px; }
    .performance-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }
    .perf-card { text-align: center; }
    .perf-content { display: flex; flex-direction: column; align-items: center; gap: 10px; }
    .perf-icon { font-size: 48px; color: #3f51b5; }
    .perf-text h3 { margin: 0; font-size: 1.8em; color: #3f51b5; }
    .perf-text p { margin: 0; color: #666; font-size: 0.9em; }
    
    .feedback-section { margin-top: 20px; }
    .feedback-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-top: 15px; }
    .feedback-card { border-left: 4px solid #3f51b5; }
    .rating-display { display: flex; align-items: center; gap: 4px; margin: 10px 0; }
    .star { color: #ffc107; font-size: 18px; width: 18px; height: 18px; }
    .rating-num { color: #666; font-size: 0.8em; margin-left: 5px; }
    .comments { font-style: italic; color: #444; }
    .no-feedback { text-align: center; color: #666; margin-top: 40px; }
  `]
})
export class Performance implements OnInit {
  performanceData: any = {
    technicianId: 0,
    technicianName: '',
    totalAssignedTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    averageCompletionHours: 0,
    slaCompliancePercentage: 0,
    averageRating: 0
  };
  recentFeedback: any[] = [];

  constructor(
    private technicianService: TechnicianService,
    private notify: NotifyService
  ) { }

  ngOnInit(): void {
    this.loadPerformanceData();
    this.loadFeedback();
  }

  loadPerformanceData(): void {
    this.technicianService.getMyPerformance().subscribe({
      next: (data: any) => {
        this.performanceData = data;
        this.recentFeedback = data.recentFeedbacks || [];
      },
      error: () => this.notify.error('Failed to load performance data')
    });
  }

  loadFeedback(): void {
    this.technicianService.getMyFeedback().subscribe({
      next: (data: any[]) => {
        this.recentFeedback = data;
      },
      error: () => this.notify.error('Failed to load feedback')
    });
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }
}
