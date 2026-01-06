import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Chart, registerables } from 'chart.js';
import { ReportsService } from '../services/reports.service';
import { NotifyService } from '../../core/services/notify.service';

Chart.register(...registerables);

@Component({
  selector: 'app-service-report',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatIconModule, MatButtonModule, MatSelectModule, MatFormFieldModule],
  template: `
    <div class="service-report-container fade-in">
      <div class="dashboard-header">
        <h1>🎯 Service Performance Analytics</h1>
        <p>Comprehensive insights into service popularity and performance</p>
      </div>

      <div class="filters">
        <mat-form-field appearance="outline">
          <mat-label>Time Period</mat-label>
          <mat-select [(value)]="selectedPeriod" (selectionChange)="loadServiceData()">
            <mat-option value="week">This Week</mat-option>
            <mat-option value="month">This Month</mat-option>
            <mat-option value="quarter">This Quarter</mat-option>
            <mat-option value="year">This Year</mat-option>
          </mat-select>
        </mat-form-field>
        <button mat-raised-button color="primary" (click)="exportReport()">
          <mat-icon>download</mat-icon>
          Export Report
        </button>
      </div>

      <div class="overview-cards">
        <mat-card class="overview-card">
          <mat-card-content>
            <div class="overview-content">
              <mat-icon class="overview-icon">build</mat-icon>
              <div class="overview-text">
                <h3>{{totalServices}}</h3>
                <p>Total Services</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="overview-card">
          <mat-card-content>
            <div class="overview-content">
              <mat-icon class="overview-icon">assignment</mat-icon>
              <div class="overview-text">
                <h3>{{totalRequests}}</h3>
                <p>Service Requests</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="overview-card">
          <mat-card-content>
            <div class="overview-content">
              <mat-icon class="overview-icon">star</mat-icon>
              <div class="overview-text">
                <h3>{{avgRating}}/5</h3>
                <p>Average Rating</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="overview-card">
          <mat-card-content>
            <div class="overview-content">
              <mat-icon class="overview-icon">schedule</mat-icon>
              <div class="overview-text">
                <h3>{{avgCompletionTime}}h</h3>
                <p>Avg Completion Time</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Popular Services Chart -->
      <mat-card class="chart-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>trending_up</mat-icon>
            Most Popular Services
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="chart-container">
            <canvas #popularServicesChart></canvas>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Service Distribution Charts -->
      <div class="charts-row">
        <mat-card class="chart-card half-width">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>donut_large</mat-icon>
              Service Category Distribution
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="chart-container">
              <canvas #categoryDistChart></canvas>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="chart-card half-width">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>show_chart</mat-icon>
              Revenue Trend Over Time
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="chart-container">
              <canvas #revenueTrendChart></canvas>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Revenue Performance Chart -->
      <mat-card class="chart-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>attach_money</mat-icon>
            Revenue Performance by Service
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="chart-container">
            <canvas #revenuePerformanceChart></canvas>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Real-time Customer Feedback -->
      <mat-card class="feedback-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>feedback</mat-icon>
            Live Customer Feedback
            <span class="live-badge">
              <span class="pulse-dot"></span>
              LIVE
            </span>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="feedback-stream">
            <div *ngFor="let feedback of recentFeedback" class="feedback-card-item">
              <div class="feedback-top">
                <div class="customer-avatar">
                  <mat-icon>person</mat-icon>
                </div>
                <div class="feedback-info">
                  <div class="customer-details">
                    <span class="customer-name">{{feedback.customerName}}</span>
                    <span class="feedback-time">{{feedback.submittedDate | date:'short'}}</span>
                  </div>
                  <div class="service-tag">
                    <mat-icon>build</mat-icon>
                    <span>{{feedback.serviceName}}</span>
                  </div>
                </div>
                <div class="rating-display">
                  <div class="stars">
                    <mat-icon *ngFor="let star of getStars(feedback.rating)" class="star-icon">star</mat-icon>
                  </div>
                  <span class="rating-value">{{feedback.rating}}/5</span>
                </div>
              </div>
              <p class="feedback-text">"{{feedback.comments}}"</p>
              <div class="feedback-sentiment" 
                   [class.positive]="feedback.rating >= 4"
                   [class.neutral]="feedback.rating === 3"
                   [class.negative]="feedback.rating < 3">
                <mat-icon>{{feedback.rating >= 4 ? 'sentiment_very_satisfied' : feedback.rating === 3 ? 'sentiment_neutral' : 'sentiment_dissatisfied'}}</mat-icon>
                <span>{{feedback.rating >= 4 ? 'Positive Experience' : feedback.rating === 3 ? 'Neutral' : 'Needs Improvement'}}</span>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .service-report-container {
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

    .overview-cards {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }

    .overview-card {
      text-align: center;
      transition: transform 0.3s ease;
    }

    .overview-card:hover {
      transform: translateY(-8px);
    }

    .overview-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 15px;
    }

    .overview-icon {
      font-size: 48px;
      color: #667eea;
    }

    .overview-text h3 {
      margin: 0;
      font-size: 2em;
      color: #667eea;
      font-weight: 600;
    }

    .overview-text p {
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

    /* Top Services */
    .top-services-grid {
      display: grid;
      gap: 16px;
    }

    .top-service-item {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 16px;
      border-left: 5px solid #e0e0e0;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .top-service-item:hover {
      transform: translateX(8px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }

    .top-service-item.champion {
      background: linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 193, 7, 0.15) 100%);
      border-left-color: #ffd700;
    }

    .top-service-item:nth-child(1) { border-left-color: #ffd700; }
    .top-service-item:nth-child(2) { border-left-color: #c0c0c0; }
    .top-service-item:nth-child(3) { border-left-color: #cd7f32; }

    .service-medal {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #e0e0e0;
      font-size: 1.5rem;
      font-weight: bold;
      flex-shrink: 0;
    }

    .service-medal.gold {
      background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
      color: #fff;
      box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
    }

    .service-medal.silver {
      background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%);
      color: #333;
      box-shadow: 0 4px 12px rgba(192, 192, 192, 0.4);
    }

    .service-medal.bronze {
      background: linear-gradient(135deg, #cd7f32 0%, #e8a87c 100%);
      color: #fff;
      box-shadow: 0 4px 12px rgba(205, 127, 50, 0.4);
    }

    .service-medal mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .service-details {
      flex: 1;
    }

    .service-details h4 {
      margin: 0 0 8px;
      color: #2d3748;
      font-size: 1.2rem;
    }

    .category-badge {
      display: inline-block;
      padding: 4px 12px;
      background: #e3f2fd;
      color: #1976d2;
      border-radius: 12px;
      font-size: 0.85rem;
      margin-bottom: 12px;
    }

    .service-metrics {
      display: flex;
      gap: 24px;
      flex-wrap: wrap;
    }

    .metric {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #6c757d;
      font-size: 0.9rem;
    }

    .metric mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .metric.rating {
      color: #ffc107;
    }

    .metric.revenue {
      color: #4caf50;
      font-weight: 600;
    }

    .service-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
      color: #fff;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
      box-shadow: 0 2px 8px rgba(255, 215, 0, 0.4);
    }

    /* Feedback Section */
    .feedback-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .live-badge {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 8px;
      background: #ff5252;
      color: white;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: white;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.2); }
    }

    .feedback-stream {
      display: grid;
      gap: 16px;
    }

    .feedback-card-item {
      padding: 20px;
      background: #f8f9fa;
      border-radius: 16px;
      border-left: 4px solid #667eea;
      transition: all 0.3s ease;
    }

    .feedback-card-item:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .feedback-top {
      display: flex;
      gap: 16px;
      margin-bottom: 12px;
    }

    .customer-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }

    .customer-avatar mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .feedback-info {
      flex: 1;
    }

    .customer-details {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
    }

    .customer-name {
      font-weight: 600;
      color: #2d3748;
      font-size: 1.05rem;
    }

    .feedback-time {
      color: #9ca3af;
      font-size: 0.85rem;
    }

    .service-tag {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #6c757d;
      font-size: 0.9rem;
    }

    .service-tag mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .rating-display {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
    }

    .stars {
      display: flex;
      gap: 2px;
    }

    .star-icon {
      color: #ffc107;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .rating-value {
      font-weight: 600;
      color: #667eea;
      font-size: 0.9rem;
    }

    .feedback-text {
      font-style: italic;
      color: #4a5568;
      margin: 16px 0;
      line-height: 1.6;
      font-size: 0.95rem;
    }

    .feedback-sentiment {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 12px;
      font-size: 0.9rem;
      font-weight: 600;
      width: fit-content;
    }

    .feedback-sentiment mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .feedback-sentiment.positive {
      background: #d1fae5;
      color: #065f46;
    }

    .feedback-sentiment.neutral {
      background: #fef3c7;
      color: #92400e;
    }

    .feedback-sentiment.negative {
      background: #fee2e2;
      color: #991b1b;
    }

    @media (max-width: 768px) {
      .overview-cards,
      .charts-row {
        grid-template-columns: 1fr;
      }

      .service-metrics {
        flex-direction: column;
        gap: 8px;
      }
    }
  `]
})
export class ServiceReport implements OnInit, AfterViewInit {
  @ViewChild('popularServicesChart') popularServicesChartRef!: ElementRef;
  @ViewChild('categoryDistChart') categoryDistChartRef!: ElementRef;
  @ViewChild('revenueTrendChart') revenueTrendChartRef!: ElementRef;
  @ViewChild('revenuePerformanceChart') revenuePerformanceChartRef!: ElementRef;

  selectedPeriod = 'month';
  totalServices = 0;
  totalRequests = 0;
  avgRating = 0;
  avgCompletionTime = 0;
  servicePerformance: any[] = [];
  popularServices: any[] = [];
  recentFeedback: any[] = [];

  private popularChart: any;
  private categoryChart: any;
  private revenueTrendChart: any;
  private revenueChart: any;

  constructor(
    private reportsService: ReportsService,
    private notify: NotifyService
  ) { }

  ngOnInit(): void {
    this.loadServiceData();
    this.loadRecentFeedback();
  }

  ngAfterViewInit(): void {
    // Charts will be created after data is loaded
  }

  loadServiceData(): void {
    this.reportsService.getServiceReport(this.selectedPeriod).subscribe({
      next: (data) => {
        this.totalServices = data.totalServices || 45;
        this.totalRequests = data.totalRequests || 523;
        this.avgRating = data.avgRating || 4.6;
        this.avgCompletionTime = data.avgCompletionTime || 24;
        this.servicePerformance = data.servicePerformance || this.generateMockServiceData();
        this.popularServices = data.popularServices || this.generateMockPopularServices();

        setTimeout(() => this.createCharts(), 100);
      },
      error: () => {
        this.notify.error('Failed to load service data');
        // Mock data
        this.totalServices = 45;
        this.totalRequests = 523;
        this.avgRating = 4.6;
        this.avgCompletionTime = 24;
        this.servicePerformance = this.generateMockServiceData();
        this.popularServices = this.generateMockPopularServices();
        setTimeout(() => this.createCharts(), 100);
      }
    });
  }

  loadRecentFeedback(): void {
    this.reportsService.getRecentFeedback().subscribe({
      next: (feedback) => {
        this.recentFeedback = feedback.slice(0, 6);
      },
      error: () => {
        this.recentFeedback = [
          { customerName: 'Alice Johnson', serviceName: 'AC Repair', rating: 5, comments: 'Exceptional service! Very professional and quick.', submittedDate: new Date() },
          { customerName: 'Bob Smith', serviceName: 'Plumbing Fix', rating: 4, comments: 'Good work, arrived on time and fixed the issue.', submittedDate: new Date(Date.now() - 1800000) },
          { customerName: 'Carol White', serviceName: 'House Painting', rating: 5, comments: 'Amazing quality! Highly recommend.', submittedDate: new Date(Date.now() - 3600000) },
          { customerName: 'David Brown', serviceName: 'Electrical Wiring', rating: 3, comments: 'Decent service but could be faster.', submittedDate: new Date(Date.now() - 5400000) },
          { customerName: 'Emma Davis', serviceName: 'Deep Cleaning', rating: 5, comments: 'Spotless! Best cleaning service ever.', submittedDate: new Date(Date.now() - 7200000) },
          { customerName: 'Frank Miller', serviceName: 'AC Repair', rating: 4, comments: 'Professional and courteous technician.', submittedDate: new Date(Date.now() - 9000000) }
        ];
      }
    });
  }

  createCharts(): void {
    this.createPopularServicesChart();
    this.createCategoryDistChart();
    this.createRevenueTrendChart();
    this.createRevenuePerformanceChart();
  }

  createPopularServicesChart(): void {
    if (this.popularChart) {
      this.popularChart.destroy();
    }

    const ctx = this.popularServicesChartRef.nativeElement.getContext('2d');
    const topServices = this.popularServices.slice(0, 8);

    this.popularChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: topServices.map(s => s.serviceName),
        datasets: [{
          label: 'Requests',
          data: topServices.map(s => s.requestCount),
          backgroundColor: topServices.map((_, i) =>
            i === 0 ? '#ffd700' :
              i === 1 ? '#c0c0c0' :
                i === 2 ? '#cd7f32' :
                  `rgba(102, 126, 234, ${0.9 - i * 0.1})`
          ),
          borderRadius: 10,
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
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            callbacks: {
              label: (context) => `Requests: ${context.parsed.y ?? 0}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
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

  createCategoryDistChart(): void {
    if (this.categoryChart) {
      this.categoryChart.destroy();
    }

    const ctx = this.categoryDistChartRef.nativeElement.getContext('2d');
    const categories = [...new Set(this.popularServices.map(s => s.categoryName))];
    const categoryData = categories.map(cat =>
      this.popularServices.filter(s => s.categoryName === cat).reduce((sum, s) => sum + s.requestCount, 0)
    );

    this.categoryChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: categories,
        datasets: [{
          data: categoryData,
          backgroundColor: [
            '#667eea',
            '#764ba2',
            '#f093fb',
            '#4facfe',
            '#43e97b',
            '#fa709a',
            '#feca57',
            '#48dbfb'
          ],
          borderWidth: 3,
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
          }
        }
      }
    });
  }

  createRevenueTrendChart(): void {
    if (this.revenueTrendChart) {
      this.revenueTrendChart.destroy();
    }

    const ctx = this.revenueTrendChartRef.nativeElement.getContext('2d');

    // Generate mock monthly revenue data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueData = [42000, 45000, 48000, 52000, 55000, 58000, 62000, 65000, 68000, 70000, 72000, 75000];

    this.revenueTrendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: 'Monthly Revenue',
          data: revenueData,
          borderColor: '#4caf50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: '#4caf50',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 7
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

  generateMockServiceData(): any[] {
    return [
      { serviceName: 'AC Repair', categoryName: 'Appliance Services', requestCount: 156, completedCount: 148, completionRate: 95, avgRating: 4.8, revenue: 45000 },
      { serviceName: 'Plumbing Fix', categoryName: 'Plumbing Services', requestCount: 142, completedCount: 135, completionRate: 95, avgRating: 4.7, revenue: 38000 },
      { serviceName: 'House Painting', categoryName: 'Painting Services', requestCount: 98, completedCount: 94, completionRate: 96, avgRating: 4.9, revenue: 52000 }
    ];
  }

  generateMockPopularServices(): any[] {
    return [
      { serviceName: 'AC Repair', categoryName: 'Appliance Services', requestCount: 156, completionRate: 95, avgRating: 4.8, revenue: 45000 },
      { serviceName: 'Plumbing Fix', categoryName: 'Plumbing Services', requestCount: 142, completionRate: 95, avgRating: 4.7, revenue: 38000 },
      { serviceName: 'House Painting', categoryName: 'Painting Services', requestCount: 98, completionRate: 96, avgRating: 4.9, revenue: 52000 },
      { serviceName: 'Electrical Wiring', categoryName: 'Electrical', requestCount: 87, completionRate: 92, avgRating: 4.6, revenue: 32000 },
      { serviceName: 'Deep Cleaning', categoryName: 'Cleaning', requestCount: 76, completionRate: 98, avgRating: 4.5, revenue: 28000 },
      { serviceName: 'Refrigerator Repair', categoryName: 'Appliance Services', requestCount: 65, completionRate: 94, avgRating: 4.7, revenue: 24000 },
      { serviceName: 'Bathroom Renovation', categoryName: 'Plumbing Services', requestCount: 54, completionRate: 91, avgRating: 4.8, revenue: 48000 },
      { serviceName: 'Ceiling Fan Installation', categoryName: 'Electrical', requestCount: 48, completionRate: 97, avgRating: 4.6, revenue: 18000 }
    ];
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  createRevenuePerformanceChart(): void {
    if (this.revenueChart) {
      this.revenueChart.destroy();
    }

    const ctx = this.revenuePerformanceChartRef.nativeElement.getContext('2d');
    const topServices = this.popularServices.slice(0, 8);

    this.revenueChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: topServices.map(s => s.serviceName),
        datasets: [{
          label: 'Revenue ($)',
          data: topServices.map(s => s.revenue),
          backgroundColor: [
            'rgba(76, 175, 80, 0.8)',
            'rgba(33, 150, 243, 0.8)',
            'rgba(255, 152, 0, 0.8)',
            'rgba(156, 39, 176, 0.8)',
            'rgba(233, 30, 99, 0.8)',
            'rgba(0, 188, 212, 0.8)',
            'rgba(255, 193, 7, 0.8)',
            'rgba(121, 85, 72, 0.8)'
          ],
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
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
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

  exportReport(): void {
    this.reportsService.exportServiceReport(this.selectedPeriod).subscribe({
      next: () => this.notify.success('Report exported successfully'),
      error: () => this.notify.error('Failed to export report')
    });
  }
}
