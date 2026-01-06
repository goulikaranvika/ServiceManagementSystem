import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthService } from './core/services/auth.service';
import { Navbar } from './shared/components/navbar/navbar';
import { Sidebar } from './shared/components/sidebar/sidebar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatSidenavModule, Navbar, Sidebar],
  template: `
    <div class="app-container" [class.auth-layout]="isAuthRoute">
      <div *ngIf="!isAuthRoute && isAuthenticated" class="main-layout">
        <app-navbar></app-navbar>
        <mat-sidenav-container class="sidenav-container">
          <mat-sidenav mode="side" opened class="sidenav">
            <app-sidebar></app-sidebar>
          </mat-sidenav>
          <mat-sidenav-content class="main-content">
            <router-outlet></router-outlet>
          </mat-sidenav-content>
        </mat-sidenav-container>
      </div>
      
      <div *ngIf="isAuthRoute || !isAuthenticated" class="auth-layout">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .app-container { height: 100vh; }
    .main-layout { height: 100%; display: flex; flex-direction: column; }
    .sidenav-container { flex: 1; }
    .sidenav { width: 250px; }
    .main-content { padding: 20px; }
    .auth-layout { height: 100vh; }
  `]
})
export class App implements OnInit {
  isAuthenticated = false;
  isAuthRoute = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      this.isAuthenticated = !!user;
    });

    this.router.events.subscribe(() => {
      const url = this.router.url;
      this.isAuthRoute = url.includes('/auth') || url === '/' || url.includes('/landing');
    });
  }
}
