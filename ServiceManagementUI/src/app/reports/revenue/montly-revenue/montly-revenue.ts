import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Chart, registerables } from 'chart.js';
import { ReportsService } from '../../services/reports.service';
import { NotifyService } from '../../../core/services/notify.service';

Chart.register(...registerables);

@Component({
  selector: 'app-monthly-revenue',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatSelectModule, MatFormFieldModule, MatButtonModule],
  template: `
    <div class="revenue-container fade-in">
      <div class="dashboard-header">
        <h1>📊 Revenue Analytics Dashboard</h1>
        <p>Real-time revenue insights and performance metrics</p>
      </div>

      <div class="filters">
        <mat-form-field appearance="outline">
          <mat-label>Year</mat-label>
          <mat-select [(value)]="selectedYear" (selectionChange)="loadRevenueData()">
            <mat-option *ngFor="let year of years" [value]="year">{{year}}</mat-option>
          </mat-select>
        </mat-form-field>
        <button mat-raised-button color="primary" (click)="exportReport()">
          <mat-icon>download</mat-icon>
          Export PDF
        </button>
      </div>

      <div class="summary-cards">
        <mat-card class="summary-card revenue-card">
          <mat-card-content>
            <div class="summary-content">
              <mat-icon class="summary-icon">attach_money</mat-icon>
              <div class="summary-text">
                <h3>\${{totalRevenue | number:'1.2-2'}}</h3>
                <p>Total Revenue ({{selectedYear}})</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card growth-card">
          <mat-card-content>
            <div class="summary-content">
              <mat-icon class="summary-icon">trending_up</mat-icon>
              <div class="summary-text">
                <h3>{{growthPercentage}}%</h3>
                <p>Growth vs Last Year</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card invoices-card">
          <mat-card-content>
            <div class="summary-content">
              <mat-icon class="summary-icon">receipt</mat-icon>
              <div class="summary-text">
                <h3>{{totalInvoices}}</h3>
                <p>Total Invoices</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Revenue Trend Chart -->
      <mat-card class="chart-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>show_chart</mat-icon>
            Monthly Revenue Trend
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="chart-container">
            <canvas #revenueChart></canvas>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Category Distribution Chart -->
      <div class="charts-row">
        <mat-card class="chart-card half-width">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>pie_chart</mat-icon>
              Revenue by Category
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="chart-container">
              <canvas #categoryChart></canvas>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="chart-card half-width">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>bar_chart</mat-icon>
              Top Performing Categories
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="chart-container">
              <canvas #categoryBarChart></canvas>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Real-time Feedback Section -->
      <mat-card class="feedback-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>feedback</mat-icon>
            Recent Customer Feedback
            <span class="live-indicator">
              <span class="pulse"></span>
              LIVE
            </span>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="feedback-list">
            <div *ngFor="let feedback of recentFeedback" class="feedback-item">
              <div class="feedback-header">
                <div class="customer-info">
                  <mat-icon>person</mat-icon>
                  <span class="customer-name">{{feedback.customerName}}</span>
                </div>
                <div class="feedback-rating">
                  <mat-icon *ngFor="let star of getStars(feedback.rating)" class="star">star</mat-icon>
                  <span class="rating-text">{{feedback.rating}}/5</span>
                </div>
              </div>
              <div class="feedback-service">
                <mat-icon>build</mat-icon>
                <span>{{feedback.serviceName}}</span>
              </div>
              <p class="feedback-comment">"{{feedback.comments}}"</p>
              <div class="feedback-footer">
                <span class="feedback-date">{{feedback.submittedDate | date:'short'}}</span>
                <span class="feedback-badge" [class.positive]="feedback.rating >= 4" [class.neutral]="feedback.rating === 3" [class.negative]="feedback.rating < 3">
                  {{feedback.rating >= 4 ? 'Positive' : feedback.rating === 3 ? 'Neutral' : 'Needs Attention'}}
                </span>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .revenue-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 32px;
      border-radius: 16px;
      margin-bottom: 32px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    .dashboard-header h1 {
      margin: 0 0 8px;
      font-size: 2rem;
      color: white;
    }

    .dashboard-header p {
      margin: 0;
      opacity: 0.9;
    }

    .filters {
      display: flex;
      gap: 20px;
      align-items: center;
      margin-bottom: 30px;
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }

    .summary-card {
      text-align: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .summary-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    }

    .revenue-card .summary-icon { color: #4caf50; }
    .growth-card .summary-icon { color: #2196f3; }
    .invoices-card .summary-icon { color: #ff9800; }

    .summary-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 15px;
    }

    .summary-icon {
      font-size: 48px;
    }

    .summary-text h3 {
      margin: 0;
      font-size: 2em;
      font-weight: 600;
    }

    .summary-text p {
      margin: 0;
      color: #666;
    }

    .chart-card {
      margin-bottom: 24px;
    }

    .chart-card mat-card-header {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      padding: 16px;
      border-radius: 8px 8px 0 0;
      margin: -16px -16px 16px;
    }

    .chart-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.2rem;
      color: #667eea;
    }

    .chart-container {
      position: relative;
      height: 350px;
      padding: 16px;
    }

    .charts-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
      margin-bottom: 24px;
    }

    .half-width .chart-container {
      height: 300px;
    }

    /* Feedback Section */
    .feedback-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .live-indicator {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 8px;
      background: #ff5252;
      color: white;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .pulse {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: white;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    .feedback-list {
      display: grid;
      gap: 16px;
    }

    .feedback-item {
      padding: 16px;
      background: #f8f9fa;
      border-radius: 12px;
      border-left: 4px solid #667eea;
    }

    .feedback-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .customer-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .customer-name {
      font-weight: 600;
      color: #2d3748;
    }

    .feedback-rating {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .feedback-rating .star {
      color: #ffc107;
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .rating-text {
      margin-left: 4px;
      font-weight: 600;
      color: #667eea;
    }

    .feedback-service {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #6c757d;
      font-size: 0.9rem;
      margin-bottom: 8px;
    }

    .feedback-service mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .feedback-comment {
      font-style: italic;
      color: #4a5568;
      margin: 12px 0;
      line-height: 1.6;
    }

    .feedback-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85rem;
    }

    .feedback-date {
      color: #9ca3af;
    }

    .feedback-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-weight: 600;
    }

    .feedback-badge.positive {
      background: #d1fae5;
      color: #065f46;
    }

    .feedback-badge.neutral {
      background: #fef3c7;
      color: #92400e;
    }

    .feedback-badge.negative {
      background: #fee2e2;
      color: #991b1b;
    }

    @media (max-width: 768px) {
      .summary-cards,
      .charts-row {
        grid-template-columns: 1fr;
      }

      .service-stats {
        flex-direction: column;
        gap: 8px;
      }
    }
  `]
})
export class MonthlyRevenue implements OnInit, AfterViewInit {
  @ViewChild('revenueChart') revenueChartRef!: ElementRef;
  @ViewChild('categoryChart') categoryChartRef!: ElementRef;
  @ViewChild('categoryBarChart') categoryBarChartRef!: ElementRef;

  selectedYear = new Date().getFullYear();
  years = [2023, 2024, 2025, 2026];
  totalRevenue = 0;
  growthPercentage = 0;
  totalInvoices = 0;
  monthlyData: any[] = [];
  categoryRevenue: any[] = [];
  recentFeedback: any[] = [];

  private revenueChart: any;
  private categoryPieChart: any;
  private categoryBarChart: any;

  constructor(
    private reportsService: ReportsService,
    private notify: NotifyService
  ) { }

  ngOnInit(): void {
    this.loadRevenueData();
    this.loadRecentFeedback();
  }

  ngAfterViewInit(): void {
    // Charts will be created after data is loaded
  }

  loadRevenueData(): void {
    this.reportsService.getMonthlyRevenue(this.selectedYear).subscribe({
      next: (data) => {
        this.totalRevenue = data.totalRevenue || 125000;
        this.growthPercentage = data.growthPercentage || 15.5;
        this.totalInvoices = data.totalInvoices || 342;
        this.monthlyData = data.monthlyData || this.generateMockMonthlyData();
        this.categoryRevenue = data.categoryRevenue || this.generateMockCategoryData();

        setTimeout(() => this.createCharts(), 100);
      },
      error: () => {
        this.notify.error('Failed to load revenue data');
        // Use mock data for demonstration
        this.totalRevenue = 125000;
        this.growthPercentage = 15.5;
        this.totalInvoices = 342;
        this.monthlyData = this.generateMockMonthlyData();
        this.categoryRevenue = this.generateMockCategoryData();
        setTimeout(() => this.createCharts(), 100);
      }
    });
  }

  loadRecentFeedback(): void {
    this.reportsService.getRecentFeedback().subscribe({
      next: (feedback) => {
        this.recentFeedback = feedback;
      },
      error: () => {
        // Mock data
        this.recentFeedback = [
          { customerName: 'John Doe', serviceName: 'AC Repair', rating: 5, comments: 'Excellent service! The technician was very professional and fixed the issue quickly.', submittedDate: new Date() },
          { customerName: 'Jane Smith', serviceName: 'Plumbing Fix', rating: 4, comments: 'Good work, but took a bit longer than expected.', submittedDate: new Date(Date.now() - 3600000) },
          { customerName: 'Mike Johnson', serviceName: 'House Painting', rating: 5, comments: 'Outstanding quality! Highly recommend this service.', submittedDate: new Date(Date.now() - 7200000) },
          { customerName: 'Sarah Williams', serviceName: 'Deep Cleaning', rating: 3, comments: 'Average service, could be better.', submittedDate: new Date(Date.now() - 10800000) }
        ];
      }
    });
  }

  createCharts(): void {
    this.createRevenueChart();
    this.createCategoryPieChart();
    this.createCategoryBarChart();
  }

  createRevenueChart(): void {
    if (this.revenueChart) {
      this.revenueChart.destroy();
    }

    const ctx = this.revenueChartRef.nativeElement.getContext('2d');
    this.revenueChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.monthlyData.map(m => m.monthName),
        datasets: [{
          label: 'Revenue',
          data: this.monthlyData.map(m => m.revenue),
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 6,
          pointBackgroundColor: '#667eea',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: { size: 14 },
            bodyFont: { size: 13 },
            callbacks: {
              label: (context) => `Revenue: $${(context.parsed.y ?? 0).toLocaleString()}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => '$' + value.toLocaleString()
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  createCategoryPieChart(): void {
    if (this.categoryPieChart) {
      this.categoryPieChart.destroy();
    }

    const ctx = this.categoryChartRef.nativeElement.getContext('2d');
    this.categoryPieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.categoryRevenue.map(c => c.categoryName),
        datasets: [{
          data: this.categoryRevenue.map(c => c.revenue),
          backgroundColor: [
            '#667eea',
            '#764ba2',
            '#f093fb',
            '#4facfe',
            '#43e97b',
            '#fa709a'
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              font: { size: 12 }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed || 0;
                return `${label}: $${value.toLocaleString()}`;
              }
            }
          }
        }
      }
    });
  }

  createCategoryBarChart(): void {
    if (this.categoryBarChart) {
      this.categoryBarChart.destroy();
    }

    const ctx = this.categoryBarChartRef.nativeElement.getContext('2d');
    this.categoryBarChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.categoryRevenue.map(c => c.categoryName),
        datasets: [{
          label: 'Revenue',
          data: this.categoryRevenue.map(c => c.revenue),
          backgroundColor: this.categoryRevenue.map((_, i) =>
            i === 0 ? '#667eea' : `rgba(102, 126, 234, ${0.8 - i * 0.15})`
          ),
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => `Revenue: $${(context.parsed.y ?? 0).toLocaleString()}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => '$' + value.toLocaleString()
            }
          }
        }
      }
    });
  }

  generateMockMonthlyData(): any[] {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({
      monthName: month,
      revenue: Math.floor(Math.random() * 15000) + 8000,
      serviceCount: Math.floor(Math.random() * 50) + 20,
      avgPerService: Math.floor(Math.random() * 200) + 150
    }));
  }

  generateMockCategoryData(): any[] {
    return [
      { categoryName: 'Appliance Services', revenue: 35000, percentage: 28, serviceCount: 45 },
      { categoryName: 'Plumbing Services', revenue: 28000, percentage: 22, serviceCount: 38 },
      { categoryName: 'Painting Services', revenue: 25000, percentage: 20, serviceCount: 32 },
      { categoryName: 'Electrical', revenue: 20000, percentage: 16, serviceCount: 28 },
      { categoryName: 'Cleaning', revenue: 17000, percentage: 14, serviceCount: 24 }
    ];
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  exportReport(): void {
    this.reportsService.exportRevenueReport(this.selectedYear).subscribe({
      next: () => this.notify.success('Report exported successfully'),
      error: () => this.notify.error('Failed to export report')
    });
  }
}
