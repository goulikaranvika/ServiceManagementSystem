import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ReportsService } from '../../services/reports.service';
import { NotifyService } from '../../../core/services/notify.service';

@Component({
  selector: 'app-workload-report',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatIconModule, MatButtonModule, MatSelectModule, MatFormFieldModule, MatProgressBarModule],
  template: `
    <div class="workload-container">
      <h2>Technician Workload Report</h2>
      
      <div class="filters">
        <mat-form-field appearance="outline">
          <mat-label>Time Period</mat-label>
          <mat-select [(value)]="selectedPeriod" (selectionChange)="loadWorkloadData()">
            <mat-option value="week">This Week</mat-option>
            <mat-option value="month">This Month</mat-option>
            <mat-option value="quarter">This Quarter</mat-option>
          </mat-select>
        </mat-form-field>
        <button mat-raised-button color="primary" (click)="exportReport()">
          <mat-icon>download</mat-icon>
          Export Report
        </button>
      </div>

      <div class="summary-cards">
        <mat-card class="summary-card">
          <mat-card-content>
            <div class="summary-content">
              <mat-icon class="summary-icon">people</mat-icon>
              <div class="summary-text">
                <h3>{{totalTechnicians}}</h3>
                <p>Active Technicians</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card">
          <mat-card-content>
            <div class="summary-content">
              <mat-icon class="summary-icon">assignment</mat-icon>
              <div class="summary-text">
                <h3>{{totalTasks}}</h3>
                <p>Total Tasks</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card">
          <mat-card-content>
            <div class="summary-content">
              <mat-icon class="summary-icon">schedule</mat-icon>
              <div class="summary-text">
                <h3>{{avgResponseTime}}h</h3>
                <p>Avg Response Time</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card">
          <mat-card-content>
            <div class="summary-content">
              <mat-icon class="summary-icon">check_circle</mat-icon>
              <div class="summary-text">
                <h3>{{completionRate}}%</h3>
                <p>Completion Rate</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="technician-performance">
        <h3>Technician Performance</h3>
        <table mat-table [dataSource]="technicianData" class="mat-elevation-8">
          <ng-container matColumnDef="technicianName">
            <th mat-header-cell *matHeaderCellDef>Technician</th>
            <td mat-cell *matCellDef="let tech">{{tech.technicianName}}</td>
          </ng-container>

          <ng-container matColumnDef="assignedTasks">
            <th mat-header-cell *matHeaderCellDef>Assigned</th>
            <td mat-cell *matCellDef="let tech">{{tech.assignedTasks}}</td>
          </ng-container>

          <ng-container matColumnDef="completedTasks">
            <th mat-header-cell *matHeaderCellDef>Completed</th>
            <td mat-cell *matCellDef="let tech">{{tech.completedTasks}}</td>
          </ng-container>

          <ng-container matColumnDef="completionRate">
            <th mat-header-cell *matHeaderCellDef>Completion Rate</th>
            <td mat-cell *matCellDef="let tech">
              <div class="progress-container">
                <mat-progress-bar mode="determinate" [value]="tech.completionRate"></mat-progress-bar>
                <span class="progress-text">{{tech.completionRate}}%</span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="avgRating">
            <th mat-header-cell *matHeaderCellDef>Avg Rating</th>
            <td mat-cell *matCellDef="let tech">
              <div class="rating">
                <mat-icon *ngFor="let star of getStars(tech.avgRating)" class="star">star</mat-icon>
                <span>{{tech.avgRating}}</span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="avgResponseTime">
            <th mat-header-cell *matHeaderCellDef>Response Time</th>
            <td mat-cell *matCellDef="let tech">{{tech.avgResponseTime}}h</td>
          </ng-container>

          <ng-container matColumnDef="workloadStatus">
            <th mat-header-cell *matHeaderCellDef>Workload</th>
            <td mat-cell *matCellDef="let tech">
              <span [class]="'workload-' + tech.workloadStatus.toLowerCase()">
                {{tech.workloadStatus}}
              </span>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>

      <div class="workload-distribution">
        <h3>Workload Distribution</h3>
        <div class="distribution-grid">
          <mat-card class="distribution-card">
            <mat-card-content>
              <h4>Overloaded</h4>
              <div class="distribution-count">{{workloadDistribution.overloaded}}</div>
              <div class="distribution-desc">Technicians with high workload</div>
            </mat-card-content>
          </mat-card>

          <mat-card class="distribution-card">
            <mat-card-content>
              <h4>Optimal</h4>
              <div class="distribution-count">{{workloadDistribution.optimal}}</div>
              <div class="distribution-desc">Technicians with balanced workload</div>
            </mat-card-content>
          </mat-card>

          <mat-card class="distribution-card">
            <mat-card-content>
              <h4>Underutilized</h4>
              <div class="distribution-count">{{workloadDistribution.underutilized}}</div>
              <div class="distribution-desc">Technicians with low workload</div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .workload-container { padding: 20px; }
    .filters { display: flex; gap: 20px; align-items: center; margin-bottom: 30px; }
    .summary-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
    .summary-card { text-align: center; }
    .summary-content { display: flex; align-items: center; justify-content: center; gap: 15px; }
    .summary-icon { font-size: 48px; color: #3f51b5; }
    .summary-text h3 { margin: 0; font-size: 2em; color: #3f51b5; }
    .summary-text p { margin: 0; color: #666; }
    table { width: 100%; margin: 20px 0; }
    .progress-container { display: flex; align-items: center; gap: 10px; }
    .progress-text { min-width: 40px; }
    .rating { display: flex; align-items: center; gap: 5px; }
    .star { color: #ffc107; font-size: 16px; }
    .workload-overloaded { color: #f44336; font-weight: bold; }
    .workload-optimal { color: #4caf50; font-weight: bold; }
    .workload-underutilized { color: #ff9800; font-weight: bold; }
    .distribution-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
    .distribution-card { text-align: center; }
    .distribution-count { font-size: 2em; font-weight: bold; color: #3f51b5; margin: 10px 0; }
    .distribution-desc { color: #666; font-size: 0.9em; }
  `]
})
export class WorkloadReport implements OnInit {
  selectedPeriod = 'month';
  totalTechnicians = 0;
  totalTasks = 0;
  avgResponseTime = 0;
  completionRate = 0;
  technicianData: any[] = [];
  workloadDistribution = { overloaded: 0, optimal: 0, underutilized: 0 };
  displayedColumns = ['technicianName', 'assignedTasks', 'completedTasks', 'completionRate', 'avgRating', 'avgResponseTime', 'workloadStatus'];

  constructor(
    private reportsService: ReportsService,
    private notify: NotifyService
  ) {}

  ngOnInit(): void {
    this.loadWorkloadData();
  }

  loadWorkloadData(): void {
    this.reportsService.getWorkloadReport(this.selectedPeriod).subscribe({
      next: (data) => {
        this.totalTechnicians = data.totalTechnicians;
        this.totalTasks = data.totalTasks;
        this.avgResponseTime = data.avgResponseTime;
        this.completionRate = data.completionRate;
        this.technicianData = data.technicianData;
        this.workloadDistribution = data.workloadDistribution;
      },
      error: () => this.notify.error('Failed to load workload data')
    });
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  exportReport(): void {
    this.reportsService.exportWorkloadReport(this.selectedPeriod).subscribe({
      next: () => this.notify.success('Report exported successfully'),
      error: () => this.notify.error('Failed to export report')
    });
  }
}

