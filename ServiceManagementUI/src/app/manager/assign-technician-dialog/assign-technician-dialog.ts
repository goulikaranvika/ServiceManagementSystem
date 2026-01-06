import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ManagerService } from '../services/manager.service';

@Component({
  selector: 'app-assign-technician-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <div class="header-content">
          <mat-icon class="header-icon">assignment_ind</mat-icon>
          <div>
            <h2 mat-dialog-title>Assign Technician</h2>
            <p class="subtitle">Select a technician for Request #{{data.requestId}}</p>
          </div>
        </div>
        <button mat-icon-button mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content>
        <!-- Search Box -->
        <div class="search-container" *ngIf="!loading && !error">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search Technicians</mat-label>
            <input matInput [(ngModel)]="searchTerm" (ngModelChange)="filterTechnicians()" placeholder="Search by name, email, or phone">
            <mat-icon matPrefix>search</mat-icon>
          </mat-form-field>
        </div>

        <!-- Loading State -->
        <div class="loading-container" *ngIf="loading">
          <mat-spinner diameter="50"></mat-spinner>
          <p>Loading technicians...</p>
        </div>

        <!-- Error State -->
        <div class="error-container" *ngIf="error">
          <mat-icon class="error-icon">error_outline</mat-icon>
          <p class="error-message">{{errorMessage}}</p>
          <button mat-raised-button color="primary" (click)="loadTechnicians()">
            <mat-icon>refresh</mat-icon>
            Retry
          </button>
        </div>

        <!-- Technician List -->
        <div class="technicians-list" *ngIf="!loading && !error">
          <!-- Debug Info -->
          <div class="debug-info" *ngIf="technicians.length > 0" style="background: #f0f0f0; padding: 8px; margin-bottom: 12px; border-radius: 4px; font-size: 12px;">
            <strong>Debug:</strong> Found {{technicians.length}} technician(s). 
            <span *ngIf="filteredTechnicians.length !== technicians.length">
              Showing {{filteredTechnicians.length}} after filter.
            </span>
          </div>

          <div class="no-results" *ngIf="filteredTechnicians.length === 0">
            <mat-icon>person_off</mat-icon>
            <p>No technicians found</p>
          </div>

          <div 
            *ngFor="let tech of filteredTechnicians; let i = index" 
            class="technician-card"
            [class.selected]="selectedTechnician?.userId === tech.userId || selectedTechnician?.id === tech.id"
            (click)="selectTechnician(tech)">
            <mat-radio-button 
              [value]="tech.userId || tech.id" 
              [checked]="selectedTechnician?.userId === tech.userId || selectedTechnician?.id === tech.id"
              (click)="$event.stopPropagation(); selectTechnician(tech)">
            </mat-radio-button>
            
            <div class="tech-avatar">
              <mat-icon>person</mat-icon>
            </div>
            
            <div class="tech-details">
              <h3 class="tech-name">{{tech.fullName || tech.name || tech.userName || 'Technician ' + (i+1)}}</h3>
              <div class="tech-info">
                <div class="info-item" *ngIf="tech.email">
                  <mat-icon>email</mat-icon>
                  <span>{{tech.email}}</span>
                </div>
                <div class="info-item" *ngIf="tech.phoneNumber || tech.phone">
                  <mat-icon>phone</mat-icon>
                  <span>{{tech.phoneNumber || tech.phone}}</span>
                </div>
                <div class="info-item" *ngIf="tech.activeAssignments !== undefined">
                  <mat-icon>assignment</mat-icon>
                  <span>{{tech.activeAssignments}} active assignments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button 
          mat-raised-button 
          color="primary" 
          [disabled]="!selectedTechnician"
          (click)="assignTechnician()">
          <mat-icon>check</mat-icon>
          Assign Technician
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      max-width: 600px;
      width: 100%;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 24px 24px 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      margin: -24px -24px 0;
    }

    .header-content {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .header-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }

    h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
    }

    .subtitle {
      margin: 4px 0 0;
      opacity: 0.9;
      font-size: 14px;
    }

    .dialog-header button {
      color: white;
    }

    mat-dialog-content {
      padding: 24px !important;
      max-height: 60vh;
      overflow-y: auto;
      min-height: 300px;
    }

    .search-container {
      margin-bottom: 16px;
    }

    .search-field {
      width: 100%;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      gap: 20px;
    }

    .loading-container p {
      color: #6c757d;
      margin: 0;
    }

    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      gap: 16px;
      text-align: center;
    }

    .error-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #d32f2f;
    }

    .error-message {
      color: #d32f2f;
      margin: 0;
      font-size: 16px;
    }

    .technicians-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .no-results {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      gap: 12px;
      color: #6c757d;
    }

    .no-results mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
    }

    .no-results p {
      margin: 0;
      font-size: 16px;
    }

    .technician-card {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 16px;
      border: 2px solid #e9ecef;
      border-radius: 12px;
      background: #f8f9fa;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .technician-card:hover {
      border-color: #667eea;
      background: #f0f4ff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
    }

    .technician-card.selected {
      border-color: #667eea;
      background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
    }

    .tech-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .tech-avatar mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: white;
    }

    .tech-details {
      flex: 1;
      min-width: 0;
    }

    .tech-name {
      margin: 0 0 8px;
      font-size: 18px;
      font-weight: 600;
      color: #2d3748;
    }

    .tech-info {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #6c757d;
      font-size: 14px;
    }

    .info-item mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #667eea;
    }

    .info-item span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    mat-dialog-actions {
      padding: 16px 24px !important;
      margin: 0 -24px -24px;
      border-top: 1px solid #e9ecef;
    }

    @media (max-width: 768px) {
      .technician-card {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .tech-info {
        align-items: center;
      }

      .info-item {
        justify-content: center;
      }
    }
  `]
})
export class AssignTechnicianDialog implements OnInit {
  technicians: any[] = [];
  filteredTechnicians: any[] = [];
  selectedTechnician: any = null;
  searchTerm: string = '';
  loading: boolean = true;
  error: boolean = false;
  errorMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<AssignTechnicianDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private managerService: ManagerService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadTechnicians();
  }

  loadTechnicians(): void {
    this.loading = true;
    this.error = false;
    this.errorMessage = '';

    this.managerService.getTechnicians().subscribe({
      next: (technicians) => {
        console.log('Technicians loaded:', technicians);
        console.log('Number of technicians:', technicians?.length);
        if (technicians && technicians.length > 0) {
          console.log('First technician:', technicians[0]);
        }
        this.technicians = technicians || [];
        this.filteredTechnicians = technicians || [];
        this.loading = false;
        // Manually trigger change detection
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 0);
      },
      error: (err) => {
        this.loading = false;
        this.error = true;
        this.errorMessage = 'Failed to load technicians. Please try again.';
        console.error('Error loading technicians:', err);
        this.cdr.detectChanges();
      }
    });
  }

  filterTechnicians(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredTechnicians = this.technicians;
      return;
    }

    this.filteredTechnicians = this.technicians.filter(tech =>
      tech.fullName?.toLowerCase().includes(term) ||
      tech.email?.toLowerCase().includes(term) ||
      tech.phoneNumber?.includes(term)
    );
  }

  selectTechnician(tech: any): void {
    this.selectedTechnician = tech;
  }

  assignTechnician(): void {
    if (this.selectedTechnician) {
      this.dialogRef.close(this.selectedTechnician);
    }
  }
}
