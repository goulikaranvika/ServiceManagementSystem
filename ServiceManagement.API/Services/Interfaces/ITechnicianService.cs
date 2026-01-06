using ServiceManagement.API.DTOs.Technician;
using ServiceManagement.API.DTOs.ServiceRequest;
using ServiceManagement.API.DTOs.Manager;

namespace ServiceManagement.API.Services.Interfaces
{
    public interface ITechnicianService
    {
        // Manager
        Task AssignTechnicianAsync(int requestId, int technicianId, int assignedBy);
        Task UpdateTaskStatusAsync(int assignmentId, string status, int technicianId);
        Task UpdateTaskStatusByManagerAsync(int assignmentId, string status);

        Task<List<TechnicianTaskDto>> GetTechnicianTasksAsync(int technicianId);
        Task<List<TechnicianPerformanceDto>> GetTechnicianPerformanceAsync();

        // Manager overview
        Task<List<ServiceRequestResponseDto>> GetAllServiceRequestsAsync();
        Task<List<ServiceRequestDto>> GetUnassignedServiceRequestsAsync();
        Task<List<AssignmentDto>> GetAllAssignmentsAsync();
        Task<List<TechnicianDto>> GetAvailableTechniciansAsync();
        Task<PerformanceStatsDto> GetPerformanceStatsAsync();

        Task<List<object>> GetTechnicianFeedbackAsync(int technicianId);
    }
}
