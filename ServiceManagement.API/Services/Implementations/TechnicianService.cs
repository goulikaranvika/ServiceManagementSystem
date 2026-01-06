using Microsoft.EntityFrameworkCore;
using ServiceManagement.API.Data;
using ServiceManagement.API.DTOs.Manager;
using ServiceManagement.API.DTOs.ServiceRequest;
using ServiceManagement.API.DTOs.Technician;
using ServiceManagement.API.Models;
using ServiceManagement.API.Services.Interfaces;

namespace ServiceManagement.API.Services.Implementations
{
    public class TechnicianService : ITechnicianService
    {
        private readonly AppDbContext _context;
        private readonly INotificationService _notificationService;
        public TechnicianService(AppDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        public async Task AssignTechnicianAsync(int requestId, int technicianId, int assignedBy)
        {
            var request = await _context.ServiceRequests
                .Include(r => r.Service)
                .FirstOrDefaultAsync(r => r.RequestId == requestId);

            if (request == null)
                throw new Exception("Service request not found");

            if (request.Status != "Requested")
                throw new Exception("Request already assigned");

            var technician = await _context.Users.FindAsync(technicianId);
            if (technician == null)
                throw new Exception("Technician not found");

            var assignment = new TechnicianAssignment
            {
                RequestId = requestId,
                TechnicianId = technicianId,
                AssignedBy = assignedBy,
                AssignedDate = DateTime.UtcNow,
                WorkStatus = "Assigned"
            };

            request.Status = "Assigned";
            _context.TechnicianAssignments.Add(assignment);
            await _context.SaveChangesAsync();
            await _notificationService.CreateNotificationAsync(
     technicianId,
     "New Task Assigned",
     $"You have been assigned a new service task for {request.Service.ServiceName}",
     "TaskAssigned"
 );

            await _notificationService.CreateNotificationAsync(
                request.CustomerId,
                "Technician Assigned",
                "A technician has been assigned to your service request",
                "ServiceRequestAssigned"
            );
        }

        public async Task<List<TechnicianTaskDto>> GetTechnicianTasksAsync(int technicianId)
        {
            return await _context.TechnicianAssignments
                .Include(a => a.ServiceRequest)
                    .ThenInclude(r => r.Service)
                        .ThenInclude(s => s.Category)
                .Where(a => a.TechnicianId == technicianId)
                .OrderByDescending(a => a.AssignedDate)
                .Select(a => new TechnicianTaskDto
                {
                    AssignmentId = a.AssignmentId,
                    RequestId = a.RequestId,
                    ServiceName = a.ServiceRequest.Service.ServiceName,
                    CategoryName = a.ServiceRequest.Service.Category.CategoryName,
                    WorkStatus = a.WorkStatus,
                    ScheduledDate = a.ServiceRequest.ScheduledDate,
                    ServiceAddress = a.ServiceRequest.ServiceAddress,
                    ServiceCity = a.ServiceRequest.ServiceCity,
                    ServicePincode = a.ServiceRequest.ServicePincode,
                    CustomerPhoneNumber = a.ServiceRequest.Customer.PhoneNumber,
                    CustomerName = a.ServiceRequest.Customer.FullName
                })
                .ToListAsync();
        }

        public async Task<List<ServiceRequestResponseDto>> GetAllServiceRequestsAsync()
        {
            return await _context.ServiceRequests
                .Include(r => r.Service)
                    .ThenInclude(s => s.Category)
                .Include(r => r.Customer)
                .OrderByDescending(r => r.CreatedDate)
                .Select(r => new ServiceRequestResponseDto
                {
                    RequestId = r.RequestId,
                    ServiceName = r.Service.ServiceName,
                    CategoryName = r.Service.Category.CategoryName,
                    Status = r.Status,
                    Priority = r.Priority,
                    ScheduledDate = r.ScheduledDate,
                    CreatedDate = r.CreatedDate,
                    CustomerName = r.Customer.FullName,
                    ServiceAddress = r.ServiceAddress,
                    ServiceCity = r.ServiceCity,
                    ServicePincode = r.ServicePincode
                })
                .ToListAsync();
        }

        public async Task<List<ServiceRequestDto>> GetUnassignedServiceRequestsAsync()
        {
            return await _context.ServiceRequests
                .Include(r => r.Service)
                    .ThenInclude(s => s.Category)
                .Include(r => r.Customer)
                .Where(r => r.Status == "Requested")
                .OrderByDescending(r => r.CreatedDate)
                .Select(r => new ServiceRequestDto
                {
                    RequestId = r.RequestId,
                    ServiceName = r.Service.ServiceName,
                    CategoryName = r.Service.Category.CategoryName,
                    Status = r.Status,
                    Priority = r.Priority,
                    ScheduledDate = r.ScheduledDate,
                    CreatedDate = r.CreatedDate,
                    CustomerName = r.Customer.FullName,
                    ServiceAddress = r.ServiceAddress,
                    ServiceCity = r.ServiceCity,
                    ServicePincode = r.ServicePincode
                })
                .ToListAsync();
        }

        public async Task<List<AssignmentDto>> GetAllAssignmentsAsync()
        {
            return await _context.TechnicianAssignments
                .Include(a => a.Technician)
                .Include(a => a.ServiceRequest)
                    .ThenInclude(r => r.Service)
                .Include(a => a.ServiceRequest)
                    .ThenInclude(r => r.Customer)
                .OrderByDescending(a => a.AssignedDate)
                .Select(a => new AssignmentDto
                {
                    AssignmentId = a.AssignmentId,
                    RequestId = a.RequestId,
                    TechnicianId = a.TechnicianId,
                    TechnicianName = a.Technician.FullName,
                    ServiceName = a.ServiceRequest.Service.ServiceName,
                    WorkStatus = a.WorkStatus,
                    AssignedDate = a.AssignedDate,
                    CustomerName = a.ServiceRequest.Customer.FullName
                })
                .ToListAsync();
        }

        public async Task<List<TechnicianDto>> GetAvailableTechniciansAsync()
        {
            return await _context.Users
                .Include(u => u.Role)
                .Where(u => u.Role.RoleName == "Technician")
                .Select(u => new TechnicianDto
                {
                    TechnicianId = u.UserId,
                    FullName = u.FullName,
                    Email = u.Email,
                    PhoneNumber = u.PhoneNumber,
                    IsAvailable = true
                })
                .ToListAsync();
        }

        public async Task<PerformanceStatsDto> GetPerformanceStatsAsync()
        {
            var totalRequests = await _context.ServiceRequests.CountAsync();
            var assignedRequests = await _context.ServiceRequests.CountAsync(r => r.Status == "Assigned");
            var completedRequests = await _context.ServiceRequests.CountAsync(r => r.Status == "Completed");
            var inProgressRequests = await _context.ServiceRequests.CountAsync(r => r.Status == "InProgress");
            var unassignedRequests = await _context.ServiceRequests.CountAsync(r => r.Status == "Requested");
            var totalTechnicians = await _context.Users.CountAsync(u => u.Role.RoleName == "Technician");

            var completedAssignments = await _context.TechnicianAssignments
                .Include(a => a.ServiceRequest)
                .Where(a => a.ServiceRequest.Status == "Completed" &&
                           a.ServiceRequest.CompletedDate.HasValue)
                .ToListAsync();

            var averageCompletionTime = completedAssignments.Any()
                ? completedAssignments.Average(a =>
                    (a.ServiceRequest.CompletedDate!.Value - a.AssignedDate).TotalHours)
                : 0;

            return new PerformanceStatsDto
            {
                TotalServiceRequests = totalRequests,
                AssignedRequests = assignedRequests,
                CompletedRequests = completedRequests,
                InProgressRequests = inProgressRequests,
                UnassignedRequests = unassignedRequests,
                TotalTechnicians = totalTechnicians,
                AverageCompletionTime = averageCompletionTime
            };
        }

        public async Task UpdateTaskStatusAsync(int assignmentId, string status, int technicianId)
        {
            var assignment = await _context.TechnicianAssignments
                .Include(a => a.ServiceRequest)
                .FirstOrDefaultAsync(a =>
                    a.AssignmentId == assignmentId &&
                    a.TechnicianId == technicianId);

            if (assignment == null)
                throw new Exception("Task not found or unauthorized");

            assignment.WorkStatus = status;

            if (status == "InProgress")
                assignment.ServiceRequest.Status = "InProgress";

            if (status == "Completed")
            {
                assignment.ServiceRequest.Status = "Completed";
                assignment.ServiceRequest.CompletedDate = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                await GenerateInvoiceForCompletedService(assignment.RequestId);

                // Notify customer
                await _notificationService.CreateNotificationAsync(
                    assignment.ServiceRequest.CustomerId,
                    "Service Completed",
                    "Your service has been completed successfully",
                    "ServiceCompleted"
                );
            }
            else
            {
                await _context.SaveChangesAsync();
            }
        }



        private async Task GenerateInvoiceForCompletedService(int requestId)
        {
            var existingInvoice = await _context.Invoices
                .FirstOrDefaultAsync(i => i.RequestId == requestId);

            if (existingInvoice != null) return;

            var request = await _context.ServiceRequests
                .Include(r => r.Service)
                .FirstOrDefaultAsync(r => r.RequestId == requestId);

            if (request == null) return;

            var subTotal = request.Service.BasePrice;
            var tax = subTotal * 0.18m;
            var total = subTotal + tax;

            var invoice = new Invoice
            {
                RequestId = requestId,
                InvoiceNumber = $"INV-{DateTime.UtcNow.Ticks}",
                InvoiceDate = DateTime.UtcNow,
                SubTotal = subTotal,
                TaxAmount = tax,
                TotalAmount = total,
                PaymentStatus = "Pending"
            };

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateTaskStatusByManagerAsync(int assignmentId, string status)
        {
            var assignment = await _context.TechnicianAssignments
                .Include(a => a.ServiceRequest)
                .FirstOrDefaultAsync(a => a.AssignmentId == assignmentId);

            if (assignment == null)
                throw new Exception("Assignment not found");

            assignment.WorkStatus = status;

            if (status == "InProgress")
                assignment.ServiceRequest.Status = "InProgress";

            if (status == "Completed")
            {
                assignment.ServiceRequest.Status = "Completed";
                assignment.ServiceRequest.CompletedDate = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
        }

        public async Task<List<TechnicianPerformanceDto>> GetTechnicianPerformanceAsync()
        {
            // 1. Fetch all technicians first
            var technicians = await _context.Users
                .Include(u => u.Role)
                .Where(u => u.Role.RoleName == "Technician")
                .ToListAsync();

            // 2. Fetch all assignments for these technicians
            var assignments = await _context.TechnicianAssignments
                .Include(a => a.ServiceRequest)
                .ToListAsync();

            // 3. Fetch all feedback
            var feedbacks = await _context.ServiceFeedbacks
                .Include(f => f.ServiceRequest)
                .ThenInclude(r => r.Service)
                .Include(f => f.Customer)
                .ToListAsync();

            // 4. Combine in memory
            var performance = technicians.Select(t =>
            {
                var tAssignments = assignments.Where(a => a.TechnicianId == t.UserId).ToList();
                var tFeedbacks = feedbacks.Where(f => tAssignments.Any(a => a.RequestId == f.RequestId)).ToList();

                return new TechnicianPerformanceDto
                {
                    TechnicianId = t.UserId,
                    TechnicianName = t.FullName,
                    TotalAssignedTasks = tAssignments.Count,
                    CompletedTasks = tAssignments.Count(x => x.WorkStatus == "Completed"),
                    InProgressTasks = tAssignments.Count(x => x.WorkStatus == "InProgress"),
                    AverageCompletionHours = tAssignments
                        .Where(a => a.WorkStatus == "Completed" && a.ServiceRequest.CompletedDate.HasValue)
                        .Select(a => (a.ServiceRequest.CompletedDate!.Value - a.AssignedDate).TotalHours)
                        .DefaultIfEmpty(0)
                        .Average(),
                    SLACompliancePercentage = tAssignments.Any() 
                        ? Math.Round((double)tAssignments.Count(x => x.WorkStatus == "Completed") * 100 / tAssignments.Count(), 2) 
                        : 0,
                    AverageRating = tFeedbacks.Any() ? Math.Round(tFeedbacks.Average(f => f.Rating), 1) : 0,
                    RecentFeedbacks = tFeedbacks.OrderByDescending(f => f.CreatedAt).Take(2).Select(f => new TechnicianFeedbackDto
                    {
                        FeedbackId = f.FeedbackId,
                        Rating = f.Rating,
                        Comments = f.Comments,
                        CreatedAt = f.CreatedAt,
                        CustomerName = f.Customer.FullName,
                        ServiceName = f.ServiceRequest.Service.ServiceName
                    }).ToList()
                };
            }).ToList();

            return performance;
        }

        public async Task<List<object>> GetTechnicianFeedbackAsync(int technicianId)
        {
            var technicianRequestIds = await _context.TechnicianAssignments
                .Where(a => a.TechnicianId == technicianId)
                .Select(a => a.RequestId)
                .ToListAsync();

            var feedbacks = await _context.ServiceFeedbacks
                .Include(f => f.ServiceRequest)
                    .ThenInclude(r => r.Service)
                .Include(f => f.Customer)
                .Where(f => technicianRequestIds.Contains(f.RequestId))
                .Select(f => new
                {
                    f.FeedbackId,
                    f.RequestId,
                    f.Rating,
                    Comments = f.Comments,
                    CreatedAt = f.CreatedAt,
                    CustomerName = f.Customer.FullName,
                    ServiceName = f.ServiceRequest.Service.ServiceName
                })
                .ToListAsync();

            return feedbacks.Cast<object>().ToList();
        }
    }
}

