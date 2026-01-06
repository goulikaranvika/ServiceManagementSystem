import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule, Router } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { ServiceRequestService } from '../../core/services/service-request.service';
import { NotifyService } from '../../core/services/notify.service';
import { ReportsService } from '../../reports/services/reports.service';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, RouterModule],
  templateUrl: './customer-dashboard.html',
  styleUrls: ['./customer-dashboard.css'],
  styles: [`
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .category-card {
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
      padding: 24px;
    }

    .category-card:hover {
      transform: translateY(-8px);
    }

    .category-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .category-icon mat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: white;
    }

    .category-card h4 {
      color: var(--primary-color);
      margin: 12px 0 8px;
    }

    .category-card p {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin-bottom: 12px;
    }

    .service-count {
      display: flex;
      justify-content: center;
    }

    .requests-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .request-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: var(--bg-secondary);
      border-radius: var(--radius-sm);
      transition: all 0.2s ease;
    }

    .request-item:hover {
      background: var(--bg-tertiary);
    }

    .request-info h4 {
      margin: 0 0 4px 0;
      color: var(--text-primary);
      font-size: 1rem;
    }

    .request-info p {
      margin: 0 0 4px 0;
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .request-info small {
      color: var(--text-light);
      font-size: 0.75rem;
    }

    .quick-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-top: 32px;
      flex-wrap: wrap;
    }

    .quick-actions button {
      min-width: 180px;
    }

    @media (max-width: 768px) {
      .categories-grid {
        grid-template-columns: 1fr;
      }

      .quick-actions {
        flex-direction: column;
      }

      .quick-actions button {
        width: 100%;
      }
    }
  `]
})
export class CustomerDashboard implements OnInit {
  categories: any[] = [];
  stats: any = null;
  recentRequests: any[] = [];
  popularServices: any[] = [];

  constructor(
    private customerService: CustomerService,
    private serviceRequestService: ServiceRequestService,
    private notify: NotifyService,
    private router: Router,
    private reportsService: ReportsService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadStats();
    this.loadRecentRequests();
    this.loadPopularServices();
  }

  loadCategories(): void {
    this.customerService.getCategories().subscribe({
      next: (categories) => this.categories = categories,
      error: () => this.notify.error('Failed to load categories')
    });
  }

  loadStats(): void {
    this.serviceRequestService.getRequestStats().subscribe({
      next: (stats) => this.stats = stats,
      error: () => { } // Silent fail
    });
  }

  loadRecentRequests(): void {
    this.serviceRequestService.getMyRequests().subscribe({
      next: (requests) => this.recentRequests = requests.slice(0, 5),
      error: () => { } // Silent fail
    });
  }

  getCategoryIcon(categoryName: string): string {
    const icons: { [key: string]: string } = {
      'Appliance Services': 'kitchen',
      'Plumbing Services': 'plumbing',
      'Painting Services': 'format_paint',
      'General Services': 'home_repair_service',
      'Electrical': 'electrical_services',
      'Cleaning': 'cleaning_services',
      'Repair': 'build',
      'Installation': 'construction'
    };
    return icons[categoryName] || 'miscellaneous_services';
  }

  createRequest(): void {
    this.router.navigate(['/customer/create-request']);
  }

  loadPopularServices(): void {
    this.reportsService.getPopularServices().subscribe({
      next: (services) => {
        this.popularServices = services.slice(0, 5);
      },
      error: () => {
        // Mock data for demonstration
        this.popularServices = [
          { serviceName: 'AC Repair', categoryName: 'Appliance Services', requestCount: 156, completionRate: 98, avgRating: 4.8, revenue: 45600 },
          { serviceName: 'Plumbing Fix', categoryName: 'Plumbing Services', requestCount: 142, completionRate: 95, avgRating: 4.7, revenue: 38200 },
          { serviceName: 'House Painting', categoryName: 'Painting Services', requestCount: 128, completionRate: 92, avgRating: 4.6, revenue: 52400 },
          { serviceName: 'Electrical Wiring', categoryName: 'Electrical', requestCount: 115, completionRate: 96, avgRating: 4.5, revenue: 41800 },
          { serviceName: 'Deep Cleaning', categoryName: 'Cleaning', requestCount: 98, completionRate: 99, avgRating: 4.9, revenue: 28600 }
        ];
      }
    });
  }
}
