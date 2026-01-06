import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { ManagerService } from '../services/manager.service';
import { NotifyService } from '../../core/services/notify.service';

@Component({
  selector: 'app-assignments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatButtonModule, MatIconModule, MatSelectModule, MatFormFieldModule, MatCardModule, MatChipsModule],
  template: `
  <div class="dashboard-container fade-in">
    <!-- Header -->
    <div class="dashboard-header">
      <h1>Technician Assignments</h1>
      <p>Overview of technician workload and task distribution</p>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon primary">
          <mat-icon>people</mat-icon>
        </div>
        <div class="stat-content">
          <h3>{{technicianWorkload.length}}</h3>
          <p>Active Technicians</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon info">
          <mat-icon>assignment</mat-icon>
        </div>
        <div class="stat-content">
          <h3>{{totalAssignments}}</h3>
          <p>Total Assignments</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon success">
          <mat-icon>trending_up</mat-icon>
        </div>
        <div class="stat-content">
          <h3>{{avgTasksPerTechnician | number:'1.1-1'}}</h3>
          <p>Avg. Tasks/Technician</p>
        </div>
      </div>
    </div>

    <!-- Workload Table -->
    <div class="content-card">
      <div class="content-card-header">
        <h3>Technician Workload Distribution</h3>
        <p class="subtitle">Monitor task allocation across your team</p>
      </div>
      
      <table mat-table [dataSource]="technicianWorkload" class="modern-table">
        <ng-container matColumnDef="technician">
          <th mat-header-cell *matHeaderCellDef>Technician</th>
          <td mat-cell *matCellDef="let item">
            <div class="technician-cell">
              <mat-icon class="tech-icon">person</mat-icon>
              <div>
                <strong>{{item.technicianName}}</strong>
                <small>{{item.skills}}</small>
              </div>
            </div>
          </td>
        </ng-container>

        <ng-container matColumnDef="totalTasks">
          <th mat-header-cell *matHeaderCellDef>Total Tasks</th>
          <td mat-cell *matCellDef="let item">
            <span class="badge badge-primary">{{item.totalTasks}}</span>
          </td>
        </ng-container>

        <ng-container matColumnDef="inProgress">
          <th mat-header-cell *matHeaderCellDef>In Progress</th>
          <td mat-cell *matCellDef="let item">
            <span class="badge badge-warning">{{item.inProgress}}</span>
          </td>
        </ng-container>

        <ng-container matColumnDef="completed">
          <th mat-header-cell *matHeaderCellDef>Completed</th>
          <td mat-cell *matCellDef="let item">
            <span class="badge badge-success">{{item.completed}}</span>
          </td>
        </ng-container>

        <ng-container matColumnDef="workloadBar">
          <th mat-header-cell *matHeaderCellDef>Workload</th>
          <td mat-cell *matCellDef="let item">
            <div class="workload-container">
              <div class="workload-bar" [class.workload-low]="item.totalTasks <= 2" 
                   [class.workload-medium]="item.totalTasks > 2 && item.totalTasks <= 5"
                   [class.workload-high]="item.totalTasks > 5">
                <div class="workload-fill" [style.width.%]="(item.totalTasks / maxTasks) * 100"></div>
              </div>
              <span class="workload-label">{{getWorkloadLevel(item.totalTasks)}}</span>
            </div>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>
      </table>
      
      <div *ngIf="technicianWorkload.length === 0" class="empty-state">
        <mat-icon>assignment_ind</mat-icon>
        <p>No assignments found</p>
      </div>
    </div>
  </div>
`,

  styles: [`
    .subtitle { color: var(--text-secondary); font-size: 0.9rem; margin: 0; }
    
    .technician-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .tech-icon {
      color: var(--primary-color);
      background: var(--bg-secondary);
      padding: 8px;
      border-radius: 50%;
    }
    
    .technician-cell strong {
      display: block;
      font-size: 0.95rem;
    }
    
    .technician-cell small {
      display: block;
      color: var(--text-secondary);
      font-size: 0.75rem;
    }
    
    .badge {
      padding: 6px 12px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.85rem;
      display: inline-block;
    }
    
    .badge-primary {
      background: #e3f2fd;
      color: #1976d2;
    }
    
    .badge-warning {
      background: #fff3e0;
      color: #f57c00;
    }
    
    .badge-success {
      background: #e8f5e9;
      color: #388e3c;
    }
    
    .workload-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .workload-bar {
      flex: 1;
      height: 8px;
      background: var(--bg-secondary);
      border-radius: 4px;
      overflow: hidden;
      position: relative;
    }
    
    .workload-fill {
      height: 100%;
      background: var(--primary-color);
      transition: width 0.3s ease;
    }
    
    .workload-low .workload-fill { background: #4caf50; }
    .workload-medium .workload-fill { background: #ff9800; }
    .workload-high .workload-fill { background: #f44336; }
    
    .workload-label {
      font-size: 0.75rem;
      font-weight: 600;
      min-width: 60px;
      text-align: right;
    }
    
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: var(--text-secondary);
    }
    
    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      opacity: 0.3;
    }
  `]
})
export class Assignments implements OnInit {
  assignments: any[] = [];
  technicianWorkload: any[] = [];
  totalAssignments = 0;
  avgTasksPerTechnician = 0;
  maxTasks = 0;
  displayedColumns = ['technician', 'totalTasks', 'inProgress', 'completed', 'workloadBar'];

  constructor(
    private managerService: ManagerService,
    private notify: NotifyService
  ) { }

  ngOnInit(): void {
    this.loadAssignments();
  }

  loadAssignments(): void {
    this.managerService.getAssignments().subscribe({
      next: (assignments) => {
        this.assignments = assignments;
        this.calculateWorkloadStats();
      },
      error: () => this.notify.error('Failed to load assignments')
    });
  }

  calculateWorkloadStats(): void {
    const techMap = new Map<number, any>();

    // Group assignments by technician
    this.assignments.forEach(assignment => {
      const techId = assignment.technicianId;
      if (!techMap.has(techId)) {
        techMap.set(techId, {
          technicianId: techId,
          technicianName: assignment.technicianName || 'Unknown',
          skills: assignment.technicianSkills || 'N/A',
          totalTasks: 0,
          inProgress: 0,
          completed: 0
        });
      }

      const tech = techMap.get(techId);
      tech.totalTasks++;

      const status = assignment.workStatus?.toLowerCase();
      if (status === 'inprogress' || status === 'assigned') {
        tech.inProgress++;
      } else if (status === 'completed') {
        tech.completed++;
      }
    });

    this.technicianWorkload = Array.from(techMap.values());
    this.totalAssignments = this.assignments.length;
    this.avgTasksPerTechnician = this.technicianWorkload.length > 0
      ? this.totalAssignments / this.technicianWorkload.length
      : 0;
    this.maxTasks = Math.max(...this.technicianWorkload.map(t => t.totalTasks), 1);
  }

  getWorkloadLevel(taskCount: number): string {
    if (taskCount <= 2) return 'Low';
    if (taskCount <= 5) return 'Medium';
    return 'High';
  }
}
