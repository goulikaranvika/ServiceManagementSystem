using ServiceManagement.API.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ServiceManagement.API.Data.Seed
{
    public static class DataSeeder
    {
        public static async Task SeedAsync(AppDbContext context)
        {
            await context.Database.EnsureCreatedAsync();

            // 1. SEED ROLES
            if (!context.Roles.Any())
            {
                context.Roles.AddRange(
                    new Role { RoleName = "Admin", Description = "System administrator with full access" },
                    new Role { RoleName = "ServiceManager", Description = "Manages service requests and technician assignments" },
                    new Role { RoleName = "Technician", Description = "Handles assigned service tasks" },
                    new Role { RoleName = "Customer", Description = "Raises service requests and tracks status" }
                );
                await context.SaveChangesAsync();
            }

            // 2. SEED USERS
            var adminRole = context.Roles.First(r => r.RoleName == "Admin");
            var managerRole = context.Roles.First(r => r.RoleName == "ServiceManager");
            var technicianRole = context.Roles.First(r => r.RoleName == "Technician");
            var customerRole = context.Roles.First(r => r.RoleName == "Customer");

            if (!context.Users.Any(u => u.Email == "admin@gmail.com"))
                context.Users.Add(new User
                {
                    FullName = "System Admin",
                    Email = "admin@gmail.com",
                    PhoneNumber = "9999999999",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    RoleId = adminRole.RoleId,
                    IsActive = true
                });

            if (!context.Users.Any(u => u.Email == "manager@gmail.com"))
                context.Users.Add(new User
                {
                    FullName = "Service Manager",
                    Email = "manager@gmail.com",
                    PhoneNumber = "9000000002",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Manager@123"),
                    RoleId = managerRole.RoleId,
                    IsActive = true
                });

            if (!context.Users.Any(u => u.Email == "tech1@gmail.com"))
                context.Users.Add(new User
                {
                    FullName = "John Smith",
                    Email = "tech1@gmail.com",
                    PhoneNumber = "7777777777",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Tech1@123"),
                    RoleId = technicianRole.RoleId,
                    IsActive = true
                });

            if (!context.Users.Any(u => u.Email == "tech2@gmail.com"))
                context.Users.Add(new User
                {
                    FullName = "Mike Johnson",
                    Email = "tech2@gmail.com",
                    PhoneNumber = "1111111111",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Tech2@123"),
                    RoleId = technicianRole.RoleId,
                    IsActive = true
                });

            if (!context.Users.Any(u => u.Email == "tech3@gmail.com"))
                context.Users.Add(new User
                {
                    FullName = "Sarah Wilson",
                    Email = "tech3@gmail.com",
                    PhoneNumber = "2222222222",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Tech3@123"),
                    RoleId = technicianRole.RoleId,
                    IsActive = true
                });

            if (!context.Users.Any(u => u.Email == "customer@gmail.com"))
                context.Users.Add(new User
                {
                    FullName = "Customer User",
                    Email = "customer@gmail.com",
                    PhoneNumber = "8888888888",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Customer@123"),
                    RoleId = customerRole.RoleId,
                    IsActive = true
                });

            if (!context.Users.Any(u => u.Email == "customer2@gmail.com"))
                context.Users.Add(new User
                {
                    FullName = "Jane Doe",
                    Email = "customer2@gmail.com",
                    PhoneNumber = "3333333333",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Customer2@123"),
                    RoleId = customerRole.RoleId,
                    IsActive = true
                });

            await context.SaveChangesAsync();

            // 3. SEED CATEGORIES (SIMPLIFIED)
            if (!context.ServiceCategories.Any())
            {
                context.ServiceCategories.AddRange(
                    new ServiceCategory
                    {
                        CategoryName = "Appliance Services",
                        Description = "AC, Washing Machine, Fridge repairs and installation"
                    },
                    new ServiceCategory
                    {
                        CategoryName = "Plumbing Services",
                        Description = "Kitchen, Bathroom, and general plumbing work"
                    },
                    new ServiceCategory
                    {
                        CategoryName = "Painting Services",
                        Description = "Interior and exterior painting services"
                    },
                    new ServiceCategory
                    {
                        CategoryName = "General Services",
                        Description = "Electrical, cleaning, and other home services"
                    }
                );
                await context.SaveChangesAsync();
            }

            // 4. SEED SERVICES (SIMPLIFIED)
            if (!context.Services.Any())
            {
                var applianceCategory = context.ServiceCategories.First(c => c.CategoryName == "Appliance Services");
                var plumbingCategory = context.ServiceCategories.First(c => c.CategoryName == "Plumbing Services");
                var paintingCategory = context.ServiceCategories.First(c => c.CategoryName == "Painting Services");
                var generalCategory = context.ServiceCategories.First(c => c.CategoryName == "General Services");

                context.Services.AddRange(
                    // Appliance Services
                    new Service
                    {
                        ServiceName = "AC Repair",
                        Description = "Professional AC repair and maintenance",
                        CategoryId = applianceCategory.CategoryId,
                        BasePrice = 500,
                        SLAHours = 24
                    },
                    new Service
                    {
                        ServiceName = "AC Installation",
                        Description = "Complete AC installation with warranty",
                        CategoryId = applianceCategory.CategoryId,
                        BasePrice = 1500,
                        SLAHours = 48
                    },
                    new Service
                    {
                        ServiceName = "Washing Machine Repair",
                        Description = "Washing machine repair and servicing",
                        CategoryId = applianceCategory.CategoryId,
                        BasePrice = 400,
                        SLAHours = 24
                    },
                    new Service
                    {
                        ServiceName = "Fridge Repair",
                        Description = "Refrigerator repair and maintenance",
                        CategoryId = applianceCategory.CategoryId,
                        BasePrice = 600,
                        SLAHours = 48
                    },

                    // Plumbing Services
                    new Service
                    {
                        ServiceName = "Kitchen Plumbing",
                        Description = "Kitchen sink, pipes, and drainage work",
                        CategoryId = plumbingCategory.CategoryId,
                        BasePrice = 300,
                        SLAHours = 12
                    },
                    new Service
                    {
                        ServiceName = "Bathroom Plumbing",
                        Description = "Bathroom fixtures and plumbing repair",
                        CategoryId = plumbingCategory.CategoryId,
                        BasePrice = 350,
                        SLAHours = 12
                    },
                    new Service
                    {
                        ServiceName = "Pipe Installation",
                        Description = "New pipe installation and replacement",
                        CategoryId = plumbingCategory.CategoryId,
                        BasePrice = 800,
                        SLAHours = 24
                    },

                    // Painting Services
                    new Service
                    {
                        ServiceName = "Interior Painting",
                        Description = "Professional interior wall painting",
                        CategoryId = paintingCategory.CategoryId,
                        BasePrice = 1000,
                        SLAHours = 72
                    },
                    new Service
                    {
                        ServiceName = "Exterior Painting",
                        Description = "Exterior wall and building painting",
                        CategoryId = paintingCategory.CategoryId,
                        BasePrice = 1500,
                        SLAHours = 96
                    },

                    // General Services
                    new Service
                    {
                        ServiceName = "Electrical Work",
                        Description = "Electrical repairs and installations",
                        CategoryId = generalCategory.CategoryId,
                        BasePrice = 250,
                        SLAHours = 8
                    },
                    new Service
                    {
                        ServiceName = "House Cleaning",
                        Description = "Complete house cleaning service",
                        CategoryId = generalCategory.CategoryId,
                        BasePrice = 200,
                        SLAHours = 4
                    },
                    new Service
                    {
                        ServiceName = "Carpet Cleaning",
                        Description = "Professional carpet and upholstery cleaning",
                        CategoryId = generalCategory.CategoryId,
                        BasePrice = 300,
                        SLAHours = 6
                    }
                );

                await context.SaveChangesAsync();
            }

            // 5. SEED SAMPLE SERVICE REQUESTS (FOR TESTING)
            var customer = context.Users.FirstOrDefault(u => u.Email == "customer@gmail.com");
            var acRepairService = context.Services.FirstOrDefault(s => s.ServiceName == "AC Repair");

            if (customer != null && acRepairService != null && !context.ServiceRequests.Any())
            {
                context.ServiceRequests.AddRange(
                    new ServiceRequest
                    {
                        CustomerId = customer.UserId,
                        ServiceId = acRepairService.ServiceId,
                        IssueTitle = "AC not cooling properly",
                        IssueDescription = "AC is running but not cooling the room effectively",
                        Priority = "High",
                        ServiceAddress = "123 Main Street",
                        ServiceCity = "New York",
                        ServicePincode = "10001",
                        Status = "Requested",
                        ScheduledDate = DateTime.UtcNow.AddDays(1)
                    },
                    new ServiceRequest
                    {
                        CustomerId = customer.UserId,
                        ServiceId = context.Services.First(s => s.ServiceName == "Kitchen Plumbing").ServiceId,
                        IssueTitle = "Kitchen sink blocked",
                        IssueDescription = "Water is not draining from kitchen sink",
                        Priority = "Medium",
                        ServiceAddress = "456 Oak Avenue",
                        ServiceCity = "Los Angeles",
                        ServicePincode = "90001",
                        Status = "Requested",
                        ScheduledDate = DateTime.UtcNow.AddDays(2)
                    }
                );

                await context.SaveChangesAsync();
            }
        }
    }
}
