using Microsoft.EntityFrameworkCore;
using ServiceManagement.API.Data;
using ServiceManagement.API.DTOs.ServiceRequest;
using ServiceManagement.API.Models;
using ServiceManagement.API.Services.Interfaces;

namespace ServiceManagement.API.Services.Implementations
{
    public class ServiceRequestService : IServiceRequestService
    {
        private readonly AppDbContext _context;

        public ServiceRequestService(AppDbContext context)
        {
            _context = context;
        }

        // =========================
        // CREATE SERVICE REQUEST
        // =========================
        public async Task CreateRequestAsync(int userId, CreateServiceRequestDto dto)
        {
            var service = await _context.Services
                .Include(s => s.Category)
               
                .FirstOrDefaultAsync(s => s.ServiceId == dto.ServiceId && s.IsActive);

            if (service == null)
                throw new Exception("Invalid service selection");

            var request = new ServiceRequest
            {
                CustomerId = userId,
                ServiceId = dto.ServiceId,
                IssueDescription = dto.IssueDescription,
                Priority = dto.Priority ?? "Medium",
                ScheduledDate = dto.ScheduledDate,
                Status = "Requested",
                CreatedDate = DateTime.UtcNow,

                // SERVICE ADDRESS SNAPSHOT
                ServiceAddress = dto.ServiceAddress,
                ServiceCity = dto.ServiceCity,
                ServicePincode = dto.ServicePincode
            };

            _context.ServiceRequests.Add(request);
            await _context.SaveChangesAsync();
        }

        // =========================
        // GET CUSTOMER REQUESTS
        // =========================
        public async Task<List<ServiceRequestResponseDto>> GetMyRequestsAsync(int userId)
        {
            return await _context.ServiceRequests
                .Include(r => r.Service)
                    .ThenInclude(s => s.Category)
                .Include(r => r.Service)
                    
                .Include(r => r.Customer)
                .Where(r => r.CustomerId == userId)
                .OrderByDescending(r => r.CreatedDate)
                .Select(r => new ServiceRequestResponseDto
                {
                    RequestId = r.RequestId,
                    ServiceName = r.Service.ServiceName,
                    CategoryName = r.Service.Category.CategoryName,
                  
                    CustomerName = r.Customer.FullName,
                    IssueDescription = r.IssueDescription,
                    Priority = r.Priority,
                    Status = r.Status,
                    ScheduledDate = r.ScheduledDate,
                    CreatedDate = r.CreatedDate,
                    ServiceAddress = r.ServiceAddress,
                    ServiceCity = r.ServiceCity,
                    ServicePincode = r.ServicePincode,

                    // Technician Information (from TechnicianAssignment)
                    TechnicianName = _context.TechnicianAssignments
                        .Where(ta => ta.RequestId == r.RequestId)
                        .Select(ta => ta.Technician.FullName)
                        .FirstOrDefault(),
                    TechnicianPhone = _context.TechnicianAssignments
                        .Where(ta => ta.RequestId == r.RequestId)
                        .Select(ta => ta.Technician.PhoneNumber)
                        .FirstOrDefault(),
                    TechnicianEmail = _context.TechnicianAssignments
                        .Where(ta => ta.RequestId == r.RequestId)
                        .Select(ta => ta.Technician.Email)
                        .FirstOrDefault(),

                    // Cancellation Details
                    CancelReason = r.CancelReason,
                    CancelledDate = r.CancelledDate
                })
                .ToListAsync();
        }


        // =========================
        // CANCEL REQUEST
        // =========================
        public async Task CancelRequestAsync(int requestId, int userId, string reason)
        {
            var request = await _context.ServiceRequests
                .FirstOrDefaultAsync(r => r.RequestId == requestId && r.CustomerId == userId);

            if (request == null)
                throw new Exception("Service request not found");

            if (request.Status != "Requested")
                throw new Exception("Only pending requests can be cancelled");

            // Store the old status before changing
            var oldStatus = request.Status;

            // Update request status and cancellation details
            request.Status = "Cancelled";
            request.CancelReason = reason;
            request.CancelledDate = DateTime.UtcNow;
            request.CancelledBy = userId;

            // Add history entry with correct old status
            _context.ServiceRequestHistories.Add(new ServiceRequestHistory
            {
                RequestId = request.RequestId,
                OldStatus = oldStatus,
                NewStatus = "Cancelled",
                ChangedBy = userId,
                Remarks = reason,
                ChangedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();
        }
    }
}
