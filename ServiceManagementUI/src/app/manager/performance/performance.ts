import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ManagerService } from '../services/manager.service';
import { NotifyService } from '../../core/services/notify.service';

@Component({
  selector: 'app-performance',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatIconModule, MatProgressBarModule],
  template: `
    <div class="performance-container">
      <h2>Technician Performance Reports</h2>
      
      <div class="stats-cards">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon">people</mat-icon>
              <div class="stat-text">
                <h3>{{totalTechnicians}}</h3>
                <p>Total Technicians</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon">assignment</mat-icon>
              <div class="stat-text">
                <h3>{{totalAssignments}}</h3>
                <p>Active Assignments</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <mat-icon class="stat-icon">check_circle</mat-icon>
              <div class="stat-text">
                <h3>{{completedTasks || 0}}</h3>
                <p>Completed Tasks</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="performance-table">
        <table mat-table [dataSource]="performanceData" class="mat-elevation-8">
          <ng-container matColumnDef="technician">
            <th mat-header-cell *matHeaderCellDef>Technician</th>
            <td mat-cell *matCellDef="let perf">{{perf.technicianName}}</td>
          </ng-container>

          <ng-container matColumnDef="totalTasks">
            <th mat-header-cell *matHeaderCellDef>Total Tasks</th>
            <td mat-cell *matCellDef="let perf">{{perf.totalAssignedTasks}}</td>
          </ng-container>

          <ng-container matColumnDef="completedTasks">
            <th mat-header-cell *matHeaderCellDef>Completed</th>
            <td mat-cell *matCellDef="let perf">{{perf.completedTasks}}</td>
          </ng-container>

          <ng-container matColumnDef="completionRate">
            <th mat-header-cell *matHeaderCellDef>Completion Rate</th>
            <td mat-cell *matCellDef="let perf">
              <div class="progress-container">
                <mat-progress-bar mode="determinate" [value]="perf.slaCompliancePercentage || 0"></mat-progress-bar>
                <span class="progress-text">{{perf.slaCompliancePercentage || 0}}%</span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="avgRating">
            <th mat-header-cell *matHeaderCellDef>Avg Rating</th>
            <td mat-cell *matCellDef="let perf">
              <div class="rating">
                <mat-icon *ngFor="let star of getStars(perf.averageRating || 0)" class="star">star</mat-icon>
                <span>{{perf.averageRating || 0}}/5</span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let perf">
              <span [class]="(perf.slaCompliancePercentage || 0) >= 80 ? 'status-active' : 'status-inactive'">
                {{(perf.slaCompliancePercentage || 0) >= 80 ? 'Excellent' : 'Needs Improvement'}}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="feedbacks">
            <th mat-header-cell *matHeaderCellDef>Recent Feedback</th>
            <td mat-cell *matCellDef="let perf">
              <div *ngIf="perf.recentFeedbacks?.length > 0; else noFeedback" class="feedback-peek">
                <span class="comment-text">"{{perf.recentFeedbacks[0].comments}}"</span>
                <small>- {{perf.recentFeedbacks[0].customerName}}</small>
              </div>
              <ng-template #noFeedback>
                <span class="no-feedback-text">No feedback yet</span>
              </ng-template>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .performance-container { padding: 20px; }
    .stats-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
    .stat-card { text-align: center; }
    .stat-content { display: flex; align-items: center; justify-content: center; gap: 15px; }
    .stat-icon { font-size: 48px; color: #3f51b5; }
    .stat-text h3 { margin: 0; font-size: 2em; color: #3f51b5; }
    .stat-text p { margin: 0; color: #666; }
    table { width: 100%; }
    .progress-container { display: flex; align-items: center; gap: 10px; }
    .progress-text { min-width: 40px; }
    .rating { display: flex; align-items: center; gap: 5px; }
    .star { color: #ffc107; font-size: 16px; }
    .status-active { color: green; font-weight: bold; }
    .status-inactive { color: red; font-weight: bold; }
    
    .feedback-peek { display: flex; flex-direction: column; max-width: 250px; }
    .comment-text { font-style: italic; color: #444; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.9em; }
    .no-feedback-text { color: #999; font-size: 0.85em; }
  `]
})
export class Performance implements OnInit {
  performanceData: any[] = [];
  totalTechnicians = 0;
  totalAssignments = 0;
  completedTasks = 0;
  displayedColumns = ['technician', 'totalTasks', 'completedTasks', 'completionRate', 'avgRating', 'status', 'feedbacks'];

  constructor(
    private managerService: ManagerService,
    private notify: NotifyService
  ) { }

  ngOnInit(): void {
    this.loadPerformanceData();
    this.loadStats();
  }

  loadPerformanceData(): void {
    this.managerService.getTechnicianPerformance().subscribe({
      next: (data) => this.performanceData = data,
      error: () => this.notify.error('Failed to load performance data')
    });
  }

  loadStats(): void {
    this.managerService.getPerformanceStats().subscribe({
      next: (stats) => {
        this.totalTechnicians = stats?.totalTechnicians || 0;
        this.totalAssignments = stats?.totalAssignments || 0;
        this.completedTasks = stats?.completedTasks || 0;
      },
      error: () => {
        this.notify.error('Failed to load stats');
        // Set defaults on error
        this.totalTechnicians = 0;
        this.totalAssignments = 0;
        this.completedTasks = 0;
      }
    });
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }
}
