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
import { MatCardModule } from '@angular/material/card';
import { AdminService } from '../services/admin.service';
import { NotifyService } from '../../core/services/notify.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatCardModule],
  template: `
    <div class="categories-container">
      <div class="form-section">
        <mat-card>
          <mat-card-header>
            <mat-card-title>{{editingCategory ? 'Edit' : 'Add'}} Category</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Category Name</mat-label>
                <input matInput formControlName="categoryName" required>
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Description</mat-label>
                <textarea matInput formControlName="description" rows="3"></textarea>
              </mat-form-field>
              
              <div class="form-actions">
                <button mat-raised-button color="primary" type="submit" [disabled]="!categoryForm.valid">
                  {{editingCategory ? 'Update' : 'Add'}} Category
                </button>
                <button mat-button type="button" (click)="resetForm()" *ngIf="editingCategory">
                  Cancel
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="table-section">
        <div class="table-header">
          <h3>Categories</h3>
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search Categories</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="Filter by name or description...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        </div>
        
        <table mat-table [dataSource]="dataSource" matSort class="mat-elevation-8">
          <ng-container matColumnDef="categoryName">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
            <td mat-cell *matCellDef="let category">{{category.categoryName}}</td>
          </ng-container>

          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Description</th>
            <td mat-cell *matCellDef="let category">{{category.description}}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let category">
              <button mat-icon-button (click)="editCategory(category)" color="primary">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button (click)="deleteCategory(category.categoryId)" color="warn">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        
        <mat-paginator [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .categories-container { padding: 20px; display: grid; grid-template-columns: 1fr 2fr; gap: 20px; }
    .full-width { width: 100%; margin-bottom: 16px; }
    .form-actions { display: flex; gap: 10px; }
    .table-section { display: flex; flex-direction: column; gap: 16px; }
    .table-header { display: flex; justify-content: space-between; align-items: center; }
    .search-field { width: 300px; margin-bottom: -15px; }
    table { width: 100%; }
    @media (max-width: 1100px) {
      .categories-container { grid-template-columns: 1fr; }
      .table-header { flex-direction: column; align-items: flex-start; gap: 10px; }
      .search-field { width: 100%; }
    }
  `]
})
export class Categories implements OnInit, AfterViewInit {
  categories: any[] = [];
  categoryForm: FormGroup;
  editingCategory: any = null;
  displayedColumns = ['categoryName', 'description', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private notify: NotifyService
  ) {
    this.categoryForm = this.fb.group({
      categoryName: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
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
        this.dataSource.data = categories;
      },
      error: () => this.notify.error('Failed to load categories')
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const categoryData = this.categoryForm.value;

      if (this.editingCategory) {
        this.adminService.updateCategory(this.editingCategory.categoryId, categoryData).subscribe({
          next: () => {
            this.notify.success('Category updated');
            this.loadCategories();
            this.resetForm();
          },
          error: (error: any) => {
            console.error('Update error:', error);
            this.notify.error('Failed to update category');
          }
        });
      } else {
        this.adminService.createCategory(categoryData).subscribe({
          next: () => {
            this.notify.success('Category created');
            this.loadCategories();
            this.resetForm();
          },
          error: (error: any) => {
            console.error('Create error:', error);
            this.notify.error('Failed to create category');
          }
        });
      }
    }
  }

  editCategory(category: any): void {
    this.editingCategory = category;
    this.categoryForm.patchValue(category);
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.adminService.deleteCategory(id).subscribe({
        next: () => {
          this.notify.success('Category deleted');
          this.loadCategories();
        },
        error: () => this.notify.error('Failed to delete category')
      });
    }
  }

  resetForm(): void {
    this.categoryForm.reset();
    this.editingCategory = null;
  }
}
