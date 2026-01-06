// Update core/guards/role-guard.ts
import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // First check if user is authenticated
  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }
  
  const requiredRole = route.data['role'];
  const requiredRoles = route.data['roles'];
  const userRole = authService.getUserRole();
  
  console.log('Role Guard - Required:', requiredRole || requiredRoles, 'User Role:', userRole);
  
  // If no role requirements, just check authentication
  if (!requiredRole && !requiredRoles) {
    return true;
  }
  
  // Check single role
  if (requiredRole && userRole === requiredRole) {
    return true;
  }
  
  // Check multiple roles
  if (requiredRoles && requiredRoles.includes(userRole)) {
    return true;
  }
  
  console.log('Access denied - redirecting to unauthorized');
  router.navigate(['/unauthorized']);
  return false;
};
