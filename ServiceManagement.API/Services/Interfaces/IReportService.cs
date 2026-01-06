using ServiceManagement.API.DTOs.Technician;

namespace ServiceManagement.API.Services.Interfaces
{
    public interface IReportService
    {
        Task<object> GetServiceStatusReportAsync();

        Task<List<TechnicianPerformanceDto>> GetTechnicianPerformanceAsync();

        Task<object> GetMonthlyRevenueReportAsync(int year);
        Task<object> GetServiceRequestsSummaryAsync();
        Task<ServiceManagement.API.DTOs.Reports.ServicePerformanceReportDto> GetServicePerformanceReportAsync(string period);
    }
}
