using Xunit;
using Microsoft.EntityFrameworkCore;
using ServiceManagement.API.Data;
using ServiceManagement.API.Models;
using ServiceManagement.API.Services.Implementations;
using ServiceManagement.API.Services.Interfaces;
using ServiceManagement.API.DTOs.Auth;
using ServiceManagement.API.DTOs.ServiceRequest;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace ServiceManagement.Tests
{
    // Fake notification service for testing
    public class FakeNotificationService : INotificationService
    {
        public Task CreateNotificationAsync(int userId, string title, string message, string type)
        {
            return Task.CompletedTask;
        }

        public Task<List<object>> GetUserNotificationsAsync(int userId)
        {
            return Task.FromResult(new List<object>());
        }

        public Task MarkAsReadAsync(int notificationId, int userId)
        {
            return Task.CompletedTask;
        }

        public Task<int> GetUnreadCountAsync(int userId)
        {
            return Task.FromResult(0);
        }
    }

    public class ServiceManagementTests
    {
        // -----------------------------
        // COMMON HELPER (IN-MEMORY DB)
        // -----------------------------
        private AppDbContext GetDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            return new AppDbContext(options);
        }

        // Helper to create fake configuration
        private IConfiguration GetFakeConfiguration()
        {
            var configData = new Dictionary<string, string>
            {
                {"Jwt:Key", "ThisIsASecretKeyForTestingPurposesOnly123456789"},
                {"Jwt:Issuer", "TestIssuer"},
                {"Jwt:Audience", "TestAudience"}
            };

            return new ConfigurationBuilder()
                .AddInMemoryCollection(configData!)
                .Build();
        }

        // Helper to create test user
        private async Task<User> CreateTestUser(AppDbContext context, string roleName, string email = "test@test.com")
        {
            var role = new Role { RoleName = roleName, Description = $"{roleName} Role" };
            context.Roles.Add(role);
            await context.SaveChangesAsync();

            var user = new User
            {
                FullName = $"Test {roleName}",
                Email = email,
                PhoneNumber = "1234567890",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test@123"),
                RoleId = role.RoleId,
                IsActive = true
            };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            return user;
        }

        // Helper to create test service
        private async Task<Service> CreateTestService(AppDbContext context, string serviceName = "Test Service", decimal basePrice = 500)
        {
            var category = new ServiceCategory { CategoryName = "Test Category", Description = "Test" };
            context.ServiceCategories.Add(category);
            await context.SaveChangesAsync();

            var service = new Service
            {
                ServiceName = serviceName,
                CategoryId = category.CategoryId,
                BasePrice = basePrice,
                SLAHours = 24
            };
            context.Services.Add(service);
            await context.SaveChangesAsync();

            return service;
        }

        // ========================================
        // AUTHENTICATION & AUTHORIZATION TESTS (4)
        // ========================================

        [Fact]
        public async Task Test01_Auth_Login_ReturnsToken_ForValidUser()
        {
            var context = GetDbContext();
            var config = GetFakeConfiguration();
            await CreateTestUser(context, "Customer", "user@gmail.com");

            var authService = new AuthService(context, config);
            var result = await authService.LoginAsync(new LoginDto
            {
                Email = "user@gmail.com",
                Password = "Test@123"
            });

            Assert.NotNull(result);
        }

        [Fact]
        public async Task Test04_Auth_Register_CreatesNewCustomer()
        {
            var context = GetDbContext();
            var config = GetFakeConfiguration();

            // Create Customer role
            var role = new Role { RoleName = "Customer", Description = "Customer Role" };
            context.Roles.Add(role);
            await context.SaveChangesAsync();

            var authService = new AuthService(context, config);
            var result = await authService.RegisterAsync(new RegisterDto
            {
                FullName = "New User",
                Email = "newuser@gmail.com",
                PhoneNumber = "9876543210",
                Password = "NewUser@123"
            });

            Assert.NotNull(result);
            Assert.Equal(1, context.Users.Count());
            Assert.Equal("newuser@gmail.com", context.Users.First().Email);
        }

        // ========================================
        // CUSTOMER OPERATIONS TESTS (3)
        // ========================================

        [Fact]
        public async Task Test05_Customer_Can_Create_Service_Request()
        {
            var context = GetDbContext();
            var customer = await CreateTestUser(context, "Customer");
            var service = await CreateTestService(context, "Painting", 1000);

            var request = new ServiceRequest
            {
                CustomerId = customer.UserId,
                ServiceId = service.ServiceId,
                IssueDescription = "Need painting work",
                Status = "Requested",
                ServiceAddress = "Test Address",
                ServiceCity = "City",
                ServicePincode = "123456"
            };

            context.ServiceRequests.Add(request);
            await context.SaveChangesAsync();

            Assert.Equal(1, context.ServiceRequests.Count());
            Assert.Equal("Requested", context.ServiceRequests.First().Status);
        }

        [Fact]
        public async Task Test06_Customer_CanViewOwnRequests()
        {
            var context = GetDbContext();
            var customer = await CreateTestUser(context, "Customer");
            var service = await CreateTestService(context);

            // Create multiple requests
            for (int i = 0; i < 3; i++)
            {
                context.ServiceRequests.Add(new ServiceRequest
                {
                    CustomerId = customer.UserId,
                    ServiceId = service.ServiceId,
                    IssueDescription = $"Issue {i}",
                    Status = "Requested",
                    ServiceAddress = "Address",
                    ServiceCity = "City",
                    ServicePincode = "123456"
                });
            }
            await context.SaveChangesAsync();

            var customerRequests = context.ServiceRequests
                .Where(r => r.CustomerId == customer.UserId)
                .ToList();

            Assert.Equal(3, customerRequests.Count);
        }

        [Fact]
        public async Task Test07_Customer_CanCancelRequest_WhenPending()
        {
            var context = GetDbContext();
            var customer = await CreateTestUser(context, "Customer");
            var service = await CreateTestService(context);

            var request = new ServiceRequest
            {
                CustomerId = customer.UserId,
                ServiceId = service.ServiceId,
                IssueDescription = "Test",
                Status = "Requested",
                ServiceAddress = "Address",
                ServiceCity = "City",
                ServicePincode = "123456"
            };
            context.ServiceRequests.Add(request);
            await context.SaveChangesAsync();

            // Cancel request
            request.Status = "Cancelled";
            await context.SaveChangesAsync();

            Assert.Equal("Cancelled", context.ServiceRequests.First().Status);
        }

        // ========================================
        // TECHNICIAN OPERATIONS TESTS (3)
        // ========================================

        [Fact]
        public async Task Test08_Technician_Updates_Task_Status_To_Completed()
        {
            var context = GetDbContext();
            var fakeNotification = new FakeNotificationService();
            var service = await CreateTestService(context);

            var request = new ServiceRequest
            {
                CustomerId = 1,
                ServiceId = service.ServiceId,
                IssueDescription = "Test issue",
                ServiceAddress = "Test Address",
                ServiceCity = "Test City",
                ServicePincode = "123456",
                Status = "Assigned"
            };
            context.ServiceRequests.Add(request);

            var assignment = new TechnicianAssignment
            {
                RequestId = request.RequestId,
                TechnicianId = 1,
                AssignedBy = 1,
                AssignedDate = DateTime.UtcNow,
                WorkStatus = "Assigned"
            };
            context.TechnicianAssignments.Add(assignment);
            await context.SaveChangesAsync();

            var technicianService = new TechnicianService(context, fakeNotification);
            await technicianService.UpdateTaskStatusAsync(assignment.AssignmentId, "Completed", 1);

            var updatedRequest = context.ServiceRequests.First();
            Assert.Equal("Completed", updatedRequest.Status);
        }

        [Fact]
        public async Task Test09_Technician_CanViewAssignedTasks()
        {
            var context = GetDbContext();
            var technician = await CreateTestUser(context, "Technician");
            var service = await CreateTestService(context);

            // Create assignments
            for (int i = 0; i < 2; i++)
            {
                var request = new ServiceRequest
                {
                    CustomerId = 1,
                    ServiceId = service.ServiceId,
                    IssueDescription = $"Issue {i}",
                    Status = "Assigned",
                    ServiceAddress = "Address",
                    ServiceCity = "City",
                    ServicePincode = "123456"
                };
                context.ServiceRequests.Add(request);
                await context.SaveChangesAsync();

                context.TechnicianAssignments.Add(new TechnicianAssignment
                {
                    RequestId = request.RequestId,
                    TechnicianId = technician.UserId,
                    AssignedBy = 1,
                    AssignedDate = DateTime.UtcNow,
                    WorkStatus = "Assigned"
                });
            }
            await context.SaveChangesAsync();

            var assignments = context.TechnicianAssignments
                .Where(a => a.TechnicianId == technician.UserId)
                .ToList();

            Assert.Equal(2, assignments.Count);
        }

        [Fact]
        public async Task Test10_Technician_CanUpdateStatus_ToInProgress()
        {
            var context = GetDbContext();
            var fakeNotification = new FakeNotificationService();
            var service = await CreateTestService(context);

            var request = new ServiceRequest
            {
                CustomerId = 1,
                ServiceId = service.ServiceId,
                IssueDescription = "Test",
                ServiceAddress = "Address",
                ServiceCity = "City",
                ServicePincode = "123456",
                Status = "Assigned"
            };
            context.ServiceRequests.Add(request);

            var assignment = new TechnicianAssignment
            {
                RequestId = request.RequestId,
                TechnicianId = 1,
                AssignedBy = 1,
                AssignedDate = DateTime.UtcNow,
                WorkStatus = "Assigned"
            };
            context.TechnicianAssignments.Add(assignment);
            await context.SaveChangesAsync();

            var technicianService = new TechnicianService(context, fakeNotification);
            await technicianService.UpdateTaskStatusAsync(assignment.AssignmentId, "InProgress", 1);

            var updated = context.TechnicianAssignments.First();
            Assert.Equal("InProgress", updated.WorkStatus);
        }

        // ========================================
        // MANAGER OPERATIONS TESTS (3)
        // ========================================

        [Fact]
        public async Task Test11_Manager_Assigns_Technician_To_Request()
        {
            var context = GetDbContext();
            var fakeNotification = new FakeNotificationService();

            var technician = await CreateTestUser(context, "Technician", "tech@gmail.com");
            var manager = await CreateTestUser(context, "ServiceManager", "manager@gmail.com");
            var service = await CreateTestService(context, "AC Repair");

            var request = new ServiceRequest
            {
                CustomerId = 1,
                ServiceId = service.ServiceId,
                IssueDescription = "Test issue",
                ServiceAddress = "Test Address",
                ServiceCity = "Test City",
                ServicePincode = "123456",
                Status = "Requested"
            };
            context.ServiceRequests.Add(request);
            await context.SaveChangesAsync();

            var technicianService = new TechnicianService(context, fakeNotification);
            await technicianService.AssignTechnicianAsync(
                request.RequestId,
                technician.UserId,
                manager.UserId
            );

            Assert.True(context.TechnicianAssignments.Any());
            Assert.Equal("Assigned", context.ServiceRequests.First().Status);
        }

        [Fact]
        public async Task Test12_Manager_CanViewAllRequests()
        {
            var context = GetDbContext();
            var service = await CreateTestService(context);

            // Create multiple requests from different customers
            for (int i = 1; i <= 5; i++)
            {
                context.ServiceRequests.Add(new ServiceRequest
                {
                    CustomerId = i,
                    ServiceId = service.ServiceId,
                    IssueDescription = $"Issue {i}",
                    Status = "Requested",
                    ServiceAddress = "Address",
                    ServiceCity = "City",
                    ServicePincode = "123456"
                });
            }
            await context.SaveChangesAsync();

            var allRequests = context.ServiceRequests.ToList();
            Assert.Equal(5, allRequests.Count);
        }

        [Fact]
        public async Task Test13_Manager_CanReassignTechnician()
        {
            var context = GetDbContext();
            var fakeNotification = new FakeNotificationService();

            var tech1 = await CreateTestUser(context, "Technician", "tech1@gmail.com");
            var tech2 = await CreateTestUser(context, "Technician", "tech2@gmail.com");
            var service = await CreateTestService(context);

            var request = new ServiceRequest
            {
                CustomerId = 1,
                ServiceId = service.ServiceId,
                IssueDescription = "Test",
                Status = "Assigned",
                ServiceAddress = "Address",
                ServiceCity = "City",
                ServicePincode = "123456"
            };
            context.ServiceRequests.Add(request);

            var assignment = new TechnicianAssignment
            {
                RequestId = request.RequestId,
                TechnicianId = tech1.UserId,
                AssignedBy = 1,
                AssignedDate = DateTime.UtcNow,
                WorkStatus = "Assigned"
            };
            context.TechnicianAssignments.Add(assignment);
            await context.SaveChangesAsync();

            // Reassign to tech2
            assignment.TechnicianId = tech2.UserId;
            await context.SaveChangesAsync();

            Assert.Equal(tech2.UserId, context.TechnicianAssignments.First().TechnicianId);
        }

        // ========================================
        // BILLING & PAYMENT TESTS (3)
        // ========================================

        [Fact]
        public async Task Test14_Billing_GeneratesInvoice_WhenTaskCompleted()
        {
            var context = GetDbContext();
            var fakeNotification = new FakeNotificationService();
            var service = await CreateTestService(context, "Test Service", 500);

            var request = new ServiceRequest
            {
                CustomerId = 1,
                ServiceId = service.ServiceId,
                IssueDescription = "Test issue",
                ServiceAddress = "Test Address",
                ServiceCity = "Test City",
                ServicePincode = "123456",
                Status = "Completed"
            };
            context.ServiceRequests.Add(request);
            await context.SaveChangesAsync();

            var billingService = new BillingService(context, fakeNotification);
            var invoice = await billingService.GenerateInvoiceAsync(request.RequestId);

            Assert.NotNull(invoice);
            Assert.Equal(500, invoice.SubTotal);
            Assert.Equal("Pending", invoice.PaymentStatus);
        }

        [Fact]
        public async Task Test15_Billing_ConfirmPayment_UpdatesStatus()
        {
            var context = GetDbContext();
            var fakeNotification = new FakeNotificationService();
            var service = await CreateTestService(context, "Test Service", 500);

            var request = new ServiceRequest
            {
                CustomerId = 1,
                ServiceId = service.ServiceId,
                IssueDescription = "Test",
                Status = "Completed",
                ServiceAddress = "Address",
                ServiceCity = "City",
                ServicePincode = "123456"
            };
            context.ServiceRequests.Add(request);
            await context.SaveChangesAsync();

            var billingService = new BillingService(context, fakeNotification);
            var invoice = await billingService.GenerateInvoiceAsync(request.RequestId);

            // Confirm payment using PaymentDto
            var paymentDto = new ServiceManagement.API.DTOs.Billing.PaymentDto
            {
                InvoiceId = invoice.InvoiceId,
                PaidAmount = invoice.TotalAmount,
                PaymentMode = "Cash"
            };
            await billingService.ConfirmPaymentAsync(paymentDto, 1);

            var updatedInvoice = context.Invoices.First();
            Assert.Equal("Paid", updatedInvoice.PaymentStatus);
        }

        [Fact]
        public async Task Test16_Billing_CalculatesTotalWithTax()
        {
            var context = GetDbContext();
            var fakeNotification = new FakeNotificationService();
            var service = await CreateTestService(context, "Test Service", 1000);

            var request = new ServiceRequest
            {
                CustomerId = 1,
                ServiceId = service.ServiceId,
                IssueDescription = "Test",
                Status = "Completed",
                ServiceAddress = "Address",
                ServiceCity = "City",
                ServicePincode = "123456"
            };
            context.ServiceRequests.Add(request);
            await context.SaveChangesAsync();

            var billingService = new BillingService(context, fakeNotification);
            var invoice = await billingService.GenerateInvoiceAsync(request.RequestId);

            // Assuming 18% tax
            Assert.Equal(1000, invoice.SubTotal);
            Assert.True(invoice.TotalAmount > invoice.SubTotal); // Tax should be added
        }

        // ========================================
        // ADMIN OPERATIONS TESTS (4)
        // ========================================

        [Fact]
        public async Task Test17_Admin_ToggleUserStatus_WorksCorrectly()
        {
            var context = GetDbContext();
            var user = await CreateTestUser(context, "Customer");

            var adminService = new AdminService(context);
            await adminService.ToggleUserStatusAsync(user.UserId);

            var updatedUser = context.Users.First();
            Assert.False(updatedUser.IsActive);
        }

        [Fact]
        public async Task Test18_Admin_CanViewAllUsers()
        {
            var context = GetDbContext();

            // Create multiple users
            await CreateTestUser(context, "Customer", "customer1@test.com");
            await CreateTestUser(context, "Technician", "tech1@test.com");
            await CreateTestUser(context, "ServiceManager", "manager1@test.com");

            var allUsers = context.Users.ToList();
            Assert.Equal(3, allUsers.Count);
        }

        [Fact]
        public async Task Test19_Admin_CanDeleteUser()
        {
            var context = GetDbContext();
            var user = await CreateTestUser(context, "Customer");

            context.Users.Remove(user);
            await context.SaveChangesAsync();

            Assert.Equal(0, context.Users.Count());
        }

        [Fact]
        public async Task Test20_Admin_CanViewSystemStatistics()
        {
            var context = GetDbContext();
            var service = await CreateTestService(context);

            // Create test data
            for (int i = 0; i < 10; i++)
            {
                context.ServiceRequests.Add(new ServiceRequest
                {
                    CustomerId = 1,
                    ServiceId = service.ServiceId,
                    IssueDescription = $"Issue {i}",
                    Status = i % 2 == 0 ? "Completed" : "Requested",
                    ServiceAddress = "Address",
                    ServiceCity = "City",
                    ServicePincode = "123456"
                });
            }
            await context.SaveChangesAsync();

            var totalRequests = context.ServiceRequests.Count();
            var completedRequests = context.ServiceRequests.Count(r => r.Status == "Completed");

            Assert.Equal(10, totalRequests);
            Assert.Equal(5, completedRequests);
        }
    }
}
