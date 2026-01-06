import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  template: `
    <div class="landing-container">
      <header class="hero-section">
        <h1>ServicePro Management</h1>
        <p>Professional Home & Office Services at Your Doorstep</p>
        <div class="cta-buttons">
          <button mat-raised-button color="primary" (click)="goToLogin()">Login</button>
          <button mat-raised-button color="accent" (click)="goToRegister()">Register</button>
        </div>
      </header>

      <section class="services-section">
        <h2>Our Services</h2>

  

<div class="services-grid">
  <mat-card class="service-card">
    <img src="https://tse2.mm.bing.net/th/id/OIP.YVLaA1BuTSK4xIleyqBTxAHaFj?pid=Api&P=0&h=180" alt="Repair Services">
    <h3>Repair Services</h3>
    <p>Expert repair for all appliances</p>
    <span class="price">Starting ₹299</span>
  </mat-card>
  <mat-card class="service-card">
    <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop" alt="Cleaning Services">
    <h3>Cleaning Services</h3>
    <p>Professional home cleaning</p>
    <span class="price">Starting ₹199</span>
  </mat-card>
  <mat-card class="service-card">
    <img src="https://static.vecteezy.com/system/resources/previews/013/612/660/non_2x/lighting-and-electricity-energy-maintenance-service-panel-cabinet-of-technician-electrical-work-on-flat-cartoon-hand-drawn-templates-illustration-vector.jpg" alt="Electrical Services">
    <h3>Electrical Services</h3>
    <p>Safe electrical installations</p>
    <span class="price">Starting ₹399</span>
  </mat-card>
</div>


      </section>

      <section class="offers-section">
        <h2>Special Offers</h2>
        <div class="offers-grid">
          <div class="offer-card">
            <h3>🎉 New User Discount</h3>
            <p>Get 20% OFF on your first service</p>
            <span class="discount">Use Code: WELCOME20</span>
          </div>
          <div class="offer-card">
            <h3>💰 Monthly Package</h3>
            <p>Subscribe and save up to 30%</p>
            <span class="discount">Starting ₹999/month</span>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .landing-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .hero-section {
      text-align: center;
      padding: 80px 20px;
      color: white;
    }
    
    .hero-section h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    
    .hero-section p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
    }
    
    .cta-buttons {
      gap: 1rem;
      display: flex;
      justify-content: center;
    }
    
    .services-section, .offers-section {
      padding: 60px 20px;
      background: white;
    }
    
    .services-section h2, .offers-section h2 {
      text-align: center;
      margin-bottom: 3rem;
      color: #333;
    }
    
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .service-card {
      text-align: center;
      padding: 2rem;
    }
    
    .service-card mat-icon {
      font-size: 3rem;
      height: 3rem;
      width: 3rem;
      color: #667eea;
    }
    
    .price {
      color: #4caf50;
      font-weight: bold;
      font-size: 1.1rem;
    }
    
    .offers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .offer-card {
      background: linear-gradient(45deg, #ff6b6b, #feca57);
      color: white;
      padding: 2rem;
      border-radius: 8px;
      text-align: center;
    }
    
    .discount {
      background: rgba(255,255,255,0.2);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      display: inline-block;
      margin-top: 1rem;
    }
  `]
})
export class LandingComponent {
  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }

  goToRegister() {
    this.router.navigate(['/auth/register']);
  }
}

