import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { CustomerService } from '../../services/customer.service';
import { ServiceRequestService } from '../../../core/services/service-request.service';
import { NotifyService } from '../../../core/services/notify.service';

@Component({
  selector: 'app-create-request',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './create-requests.html',
  styleUrls: ['./create-requests.css']
})
export class CreateRequests implements OnInit {
  requestForm: FormGroup;
  categories: any[] = [];
  selectedCategoryServices: any[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private serviceRequestService: ServiceRequestService,
    private notify: NotifyService
  ) {
    this.requestForm = this.fb.group({
      categoryId: ['', Validators.required],
      serviceId: ['', Validators.required],
      issueDescription: ['', Validators.required],
      priority: ['Medium', Validators.required],
      scheduledDate: ['', Validators.required],
      serviceAddress: ['', Validators.required],
      serviceCity: ['', Validators.required],
      servicePincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });

    // Set minimum date to today
    const today = new Date();
    const minDate = today.toISOString().slice(0, 16);
    this.requestForm.patchValue({
      scheduledDate: minDate,
      priority: 'Medium'
    });
  }


  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.customerService.getCategories().subscribe({
      next: (categories) => this.categories = categories,
      error: () => this.notify.error('Failed to load categories')
    });
  }

  onCategoryChange(categoryId: number): void {
    this.customerService.getServicesByCategory(categoryId).subscribe({
      next: (services) => {
        this.selectedCategoryServices = services;
        this.requestForm.patchValue({ serviceId: '' });
      },
      error: () => this.notify.error('Failed to load services')
    });
  }

  getSelectedService(): any {
    const serviceId = this.requestForm.get('serviceId')?.value;
    return this.selectedCategoryServices.find(s => s.serviceId === serviceId);
  }

  onSubmit(): void {
    if (this.requestForm.valid) {
      this.loading = true;
      // Using ServiceRequestService instead of CustomerService
      this.serviceRequestService.createRequest(this.requestForm.value).subscribe({
        next: () => {
          this.notify.success('Service request created successfully!');
          this.resetForm();
          this.loading = false;
        },
        error: () => {
          this.notify.error('Failed to create service request');
          this.loading = false;
        }
      });
    }
  }

  resetForm(): void {
    this.requestForm.reset();
    this.requestForm.patchValue({ priority: 'Medium' });
    this.selectedCategoryServices = [];
  }
}

