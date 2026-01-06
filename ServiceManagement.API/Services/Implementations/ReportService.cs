using Microsoft.EntityFrameworkCore;
using ServiceManagement.API.Data;
using ServiceManagement.API.DTOs.Technician;
using ServiceManagement.API.Services.Interfaces;

namespace ServiceManagement.API.Services.Implementations
{
    public class ReportService : IReportService
    {
        private readonly AppDbContext _context;

        public ReportService(AppDbContext context)
        {
            _context = context;
        }

        // =========================
        // SERVICE STATUS REPORT
        // =========================

        public async Task<object> GetServiceStatusReportAsync()
        {
            var statusReport = await _context.ServiceRequests
                .Include(r => r.Service)
                .Include(r => r.Customer)
                .GroupBy(r => r.Status)
                .Select(g => new
                {
                    Status = g.Key,
                    Count = g.Count(),
                    Percentage = Math.Round((double)g.Count() * 100 / _context.ServiceRequests.Count(), 2),
                    Requests = g.Select(r => new
                    {
                        r.RequestId,
                        r.Service.ServiceName,
                        r.Customer.FullName,
                        r.CreatedDate,
                        r.Priority
                    }).Take(5).ToList()
                })
                .ToListAsync();

            return statusReport;
        }

        // =========================
        // TECHNICIAN PERFORMANCE
        // =========================
        public async Task<List<TechnicianPerformanceDto>> GetTechnicianPerformanceAsync()
        {
            var performance = await _context.TechnicianAssignments
                .Include(a => a.Technician)
                .Include(a => a.ServiceRequest)
                .GroupBy(a => new
                {
                    a.TechnicianId,
                    a.Technician.FullName
                })
                .Select(g => new TechnicianPerformanceDto
                {
                    TechnicianId = g.Key.TechnicianId,
                    TechnicianName = g.Key.FullName,
                    TotalAssignedTasks = g.Count(),
                    CompletedTasks = g.Count(a => a.WorkStatus == "Completed"),
                    InProgressTasks = g.Count(a => a.WorkStatus == "InProgress"),
                    AverageCompletionHours = g
                        .Where(a => a.WorkStatus == "Completed" && a.ServiceRequest.CompletedDate.HasValue)
                        .Select(a => (a.ServiceRequest.CompletedDate!.Value - a.AssignedDate).TotalHours)
                        .DefaultIfEmpty(0)
                        .Average(),
                    SLACompliancePercentage = Math.Round(
                        (double)g.Count(a => a.WorkStatus == "Completed") * 100 / g.Count(), 2),
                    AverageRating = 4.2 // Placeholder - can be calculated from feedback
                })
                .ToListAsync();

            return performance;
        }

        public async Task<object> GetMonthlyRevenueReportAsync(int year)
        {
            var revenueData = await _context.ServiceRequests
                .Include(r => r.Service)
                .Where(r => r.Status == "Completed" && r.CreatedDate.Year == year)
                .GroupBy(r => r.CreatedDate.Month)
                .Select(g => new
                {
                    Month = g.Key,
                    MonthName = new DateTime(year, g.Key, 1).ToString("MMMM"),
                    Revenue = g.Sum(r => r.Service.BasePrice),
                    CompletedServices = g.Count(),
                    AverageServiceValue = Math.Round(g.Average(r => r.Service.BasePrice), 2)
                })
                .OrderBy(r => r.Month)
                .ToListAsync();

            var totalRevenue = revenueData.Sum(r => r.Revenue);
            var totalServices = revenueData.Sum(r => r.CompletedServices);

            return new
            {
                Year = year,
                TotalRevenue = totalRevenue,
                TotalCompletedServices = totalServices,
                AverageMonthlyRevenue = Math.Round(totalRevenue / 12, 2),
                MonthlyData = revenueData
            };
        }

        // NEW: Service requests summary for admin dashboard
        public async Task<object> GetServiceRequestsSummaryAsync()
        {
            var totalRequests = await _context.ServiceRequests.CountAsync();
            var requestsByStatus = await _context.ServiceRequests
                .GroupBy(r => r.Status)
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .ToListAsync();

            var recentRequests = await _context.ServiceRequests
                .Include(r => r.Service)
                .Include(r => r.Customer)
                .OrderByDescending(r => r.CreatedDate)
                .Take(10)
                .Select(r => new
                {
                    r.RequestId,
                    r.Service.ServiceName,
                    r.Customer.FullName,
                    r.Status,
                    r.Priority,
                    r.CreatedDate
                })
                .ToListAsync();

            return new
            {
                TotalRequests = totalRequests,
                RequestsByStatus = requestsByStatus,
                RecentRequests = recentRequests
            };
        }

        public async Task<ServiceManagement.API.DTOs.Reports.ServicePerformanceReportDto> GetServicePerformanceReportAsync(string period)
        {
            // Determine date range
            var endDate = DateTime.UtcNow;
            var startDate = period.ToLower() switch
            {
                "week" => endDate.AddDays(-7),
                "month" => endDate.AddMonths(-1),
                "quarter" => endDate.AddMonths(-3),
                "year" => endDate.AddYears(-1),
                _ => DateTime.MinValue
            };

            var query = _context.ServiceRequests
                .Include(r => r.Service)
                .ThenInclude(s => s.Category)
                .Where(r => r.CreatedDate >= startDate);

            var requests = await query.ToListAsync();

            // Aggregation
            var groupedServices = requests
                .GroupBy(r => new { r.ServiceId, r.Service.ServiceName, r.Service.Category.CategoryName, r.Service.BasePrice })
                .Select(g => new ServiceManagement.API.DTOs.Reports.ServicePerformanceItemDto
                {
                    ServiceName = g.Key.ServiceName,
                    CategoryName = g.Key.CategoryName,
                    RequestCount = g.Count(),
                    CompletedCount = g.Count(r => r.Status == "Completed"),
                    CompletionRate = g.Any() ? Math.Round((double)g.Count(r => r.Status == "Completed") * 100 / g.Count(), 1) : 0,
                    Revenue = g.Where(r => r.Status == "Completed").Sum(r => g.Key.BasePrice), // Simplified revenue
                    AvgRating = 4.5 // Placeholder until Feedback linked
                })
                .ToList();

            var totalStats = new ServiceManagement.API.DTOs.Reports.ServicePerformanceReportDto
            {
                TotalServices = _context.Services.Count(),
                TotalRequests = requests.Count,
                AvgRating = groupedServices.Any() ? Math.Round(groupedServices.Average(s => s.AvgRating), 1) : 0,
                AvgCompletionTime = 24, // Placeholder
                ServicePerformance = groupedServices,
                PopularServices = groupedServices.OrderByDescending(s => s.RequestCount).Take(3).ToList()
            };

            return totalStats;
        }
    }
}
