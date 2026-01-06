import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminService } from '../services/admin.service';
import { NotifyService } from '../../core/services/notify.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatTableModule, MatPaginatorModule,
    MatSortModule, MatButtonModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatCardModule, MatTooltipModule
  ],
  template: `
    <div class="dashboard-container fade-in">
      <!-- Header -->
      <div class="dashboard-header">
        <h1>Service Catalog</h1>
        <p>Manage services, pricing, and service level agreements</p>
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon primary">
            <mat-icon>build</mat-icon>
          </div>
          <div class="stat-content">
            <h3>{{services.length}}</h3>
            <p>Active Services</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon info">
            <mat-icon>category</mat-icon>
          </div>
          <div class="stat-content">
            <h3>{{categories.length}}</h3>
            <p>Categories</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon success">
            <mat-icon>trending_up</mat-icon>
          </div>
          <div class="stat-content">
            <h3>₹{{avgPrice | number:'1.0-0'}}</h3>
            <p>Avg. Price</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon warning">
            <mat-icon>timer</mat-icon>
          </div>
          <div class="stat-content">
            <h3>{{avgSla}}h</h3>
            <p>Avg. SLA</p>
          </div>
        </div>
      </div>

      <!-- Category Overview -->
      <div class="category-overview">
        <div class="section-header">
          <h2>Services by Category</h2>
          <p>Quick overview of service distribution</p>
        </div>
        <div class="category-grid">
          <div *ngFor="let stat of categoryStats" class="category-card" [style.border-left-color]="stat.color">
            <div class="category-icon" [style.background-color]="stat.color + '20'">
              <mat-icon [style.color]="stat.color">category</mat-icon>
            </div>
            <div class="category-info">
              <h4>{{stat.category?.categoryName || 'Uncategorized'}}</h4>
              <p class="category-description">{{stat.category?.description || 'No description'}}</p>
            </div>
            <div class="category-count" [style.color]="stat.color">
              <span class="count-number">{{stat.count}}</span>
              <span class="count-label">{{stat.count === 1 ? 'Service' : 'Services'}}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="admin-grid">
        <!-- Form Section -->
        <mat-card class="form-section">
          <div class="content-card-header">
            <h3>{{editingService ? 'Update' : 'Add New'}} Service</h3>
          </div>
          <mat-card-content>
            <form [formGroup]="serviceForm" (ngSubmit)="onSubmit()" class="modern-form">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Service Name</mat-label>
                <input matInput formControlName="serviceName" placeholder="e.g. AC Repair" required>
                <mat-icon matPrefix>settings_suggest</mat-icon>
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Category</mat-label>
                <mat-select formControlName="categoryId" required>
                  <mat-option *ngFor="let category of categories" [value]="category.categoryId">
                    {{category.categoryName}}
                  </mat-option>
                </mat-select>
                <mat-icon matPrefix>category</mat-icon>
              </mat-form-field>
              
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Base Price</mat-label>
                  <input matInput type="number" formControlName="basePrice" required>
                  <span matPrefix>₹&nbsp;</span>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>SLA (Hours)</mat-label>
                  <input matInput type="number" formControlName="slaHours" required>
                  <mat-icon matSuffix>timer</mat-icon>
                </mat-form-field>
              </div>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Description</mat-label>
                <textarea matInput formControlName="description" rows="3" placeholder="Describe the service offerings..."></textarea>
              </mat-form-field>
              
              <div class="form-actions">
                <button mat-flat-button color="primary" type="submit" [disabled]="!serviceForm.valid" class="full-width">
                  {{editingService ? 'Update Service' : 'Create Service'}}
                </button>
                <button mat-stroked-button type="button" (click)="resetForm()" *ngIf="editingService" class="full-width">
                  Cancel
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>

        <!-- Table Section -->
        <div class="content-card table-section">
          <div class="content-card-header">
            <h3>Available Services</h3>
            <div class="search-box">
              <mat-form-field appearance="outline">
                <mat-label>Search Services</mat-label>
                <input matInput (keyup)="applyFilter($event)" placeholder="Filter by name...">
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>
            </div>
          </div>
          
          <table mat-table [dataSource]="dataSource" matSort class="modern-table">
            <ng-container matColumnDef="serviceName">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Service Name</th>
              <td mat-cell *matCellDef="let service">
                <div class="service-cell">
                  <strong>{{service.serviceName}}</strong>
                  <small>{{service.description | slice:0:40}}{{service.description?.length > 40 ? '...' : ''}}</small>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="categoryName">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Category</th>
              <td mat-cell *matCellDef="let service">
                <span class="category-badge">{{service.category?.categoryName || 'General'}}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="basePrice">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Price</th>
              <td mat-cell *matCellDef="let service">
                <strong class="price-text">₹{{service.basePrice | number:'1.2-2'}}</strong>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let service">
                <button mat-icon-button color="primary" (click)="editService(service)" matTooltip="Edit">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteService(service.serviceId)" matTooltip="Delete">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>
          </table>
          <mat-paginator [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons></mat-paginator>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-grid {
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: 24px;
      margin-top: 24px;
    }

    .form-section {
      height: fit-content;
    }

    .modern-form {
      padding-top: 16px;
    }

    .form-row {
      display: flex;
      gap: 12px;
    }

    .form-row mat-form-field {
      flex: 1;
    }

    .full-width {
      width: 100%;
    }

    .form-actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 16px;
    }

    .search-box mat-form-field {
      margin-bottom: -15px;
      width: 250px;
    }

    .service-cell {
      display: flex;
      flex-direction: column;
      padding: 8px 0;
    }

    .service-cell small {
      color: var(--text-secondary);
      font-size: 0.75rem;
    }

    .category-badge {
      background: var(--bg-secondary);
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 0.85rem;
      border: 1px solid var(--border-color);
    }

    .price-text {
      color: var(--primary-color);
      font-size: 1rem;
    }

    /* Category Overview Styles */
    .category-overview {
      margin: 32px 0;
    }

    .section-header {
      margin-bottom: 20px;
    }

    .section-header h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 4px 0;
    }

    .section-header p {
      color: var(--text-secondary);
      margin: 0;
      font-size: 0.9rem;
    }

    .category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }

    .category-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-left: 4px solid;
      border-radius: 8px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .category-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .category-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .category-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .category-info {
      flex: 1;
      min-width: 0;
    }

    .category-info h4 {
      margin: 0 0 4px 0;
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .category-description {
      margin: 0;
      font-size: 0.75rem;
      color: var(--text-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .category-count {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 12px;
      background: rgba(0, 0, 0, 0.03);
      border-radius: 8px;
      min-width: 60px;
    }

    .count-number {
      font-size: 1.5rem;
      font-weight: 700;
      line-height: 1;
    }

    .count-label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 4px;
      opacity: 0.8;
    }

    @media (max-width: 1100px) {
      .admin-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class Services implements OnInit, AfterViewInit {
  services: any[] = [];
  categories: any[] = [];
  serviceForm: FormGroup;
  editingService: any = null;
  displayedColumns = ['serviceName', 'categoryName', 'basePrice', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  avgPrice = 0;
  avgSla = 0;
  categoryStats: { category: any; count: number; color: string }[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private notify: NotifyService
  ) {
    this.serviceForm = this.fb.group({
      serviceName: ['', Validators.required],
      categoryId: ['', Validators.required],
      basePrice: ['', [Validators.required, Validators.min(0)]],
      slaHours: [24, Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadServices();
    this.loadCategories();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadCategories(): void {
    this.adminService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      }
    });
  }

  loadServices(): void {
    this.adminService.getServices().subscribe({
      next: (services) => {
        this.services = services;
        this.dataSource.data = services;
        this.calculateStats();
      },
      error: () => this.notify.error('Failed to load services')
    });
  }

  calculateStats(): void {
    if (this.services.length > 0) {
      this.avgPrice = this.services.reduce((sum, s) => sum + s.basePrice, 0) / this.services.length;
      this.avgSla = this.services.reduce((sum, s) => sum + s.slaHours, 0) / this.services.length;
    }
    this.calculateCategoryStats();
  }

  calculateCategoryStats(): void {
    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336', '#00BCD4', '#FFEB3B', '#E91E63'];

    const categoryMap = new Map<number, { category: any; count: number }>();

    // Count services per category
    this.services.forEach(service => {
      const categoryId = service.categoryId || service.category?.categoryId;
      if (categoryId) {
        if (categoryMap.has(categoryId)) {
          categoryMap.get(categoryId)!.count++;
        } else {
          categoryMap.set(categoryId, {
            category: service.category,
            count: 1
          });
        }
      }
    });

    // Add categories with 0 services
    this.categories.forEach(category => {
      if (!categoryMap.has(category.categoryId)) {
        categoryMap.set(category.categoryId, {
          category: category,
          count: 0
        });
      }
    });

    // Convert to array and assign colors
    this.categoryStats = Array.from(categoryMap.values()).map((stat, index) => ({
      ...stat,
      color: colors[index % colors.length]
    }));
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onSubmit(): void {
    if (this.serviceForm.valid) {
      const serviceData = { ...this.serviceForm.value };

      if (this.editingService) {
        this.adminService.updateService(this.editingService.serviceId, serviceData).subscribe({
          next: () => {
            this.notify.success('Service updated successfully');
            this.loadServices();
            this.resetForm();
          },
          error: () => this.notify.error('Failed to update service')
        });
      } else {
        this.adminService.createService(serviceData).subscribe({
          next: () => {
            this.notify.success('Service created successfully');
            this.loadServices();
            this.resetForm();
          },
          error: () => this.notify.error('Failed to create service')
        });
      }
    }
  }

  editService(service: any): void {
    this.editingService = service;
    this.serviceForm.patchValue({
      serviceName: service.serviceName,
      categoryId: service.categoryId,
      basePrice: service.basePrice,
      slaHours: service.slaHours,
      description: service.description
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteService(id: number): void {
    if (confirm('Are you sure you want to delete this service?')) {
      this.adminService.deleteService(id).subscribe({
        next: () => {
          this.notify.success('Service deleted successfully');
          this.loadServices();
        },
        error: () => this.notify.error('Failed to delete service')
      });
    }
  }

  resetForm(): void {
    this.serviceForm.reset({
      slaHours: 24
    });
    this.editingService = null;
  }
}


