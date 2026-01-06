using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceManagement.API.Services.Interfaces;

namespace ServiceManagement.API.Controllers
{
    [ApiController]
    [Route("api/reports")]
    [Authorize(Roles = "Admin,ServiceManager")]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportsController(IReportService reportService)
        {
            _reportService = reportService;
        }

        // =========================
        // SERVICE STATUS REPORT
        // =========================
        [HttpGet("service-status")]
        public async Task<IActionResult> GetServiceStatus()
        {
            return Ok(await _reportService.GetServiceStatusReportAsync());
        }

        // =========================
        // TECHNICIAN PERFORMANCE
        // =========================
        [HttpGet("technician-performance")]
        public async Task<IActionResult> GetTechnicianPerformance()
        {
            return Ok(await _reportService.GetTechnicianPerformanceAsync());
        }

        // =========================
        // MONTHLY REVENUE
        // =========================
        [HttpGet("monthly-revenue/{year}")]
        public async Task<IActionResult> GetMonthlyRevenue(int year)
        {
            return Ok(await _reportService.GetMonthlyRevenueReportAsync(year));
        }

        // =========================
        // SERVICE PERFORMANCE REPORT
        // =========================
        [HttpGet("services/{period}")]
        public async Task<IActionResult> GetServicePerformance(string period)
        {
            return Ok(await _reportService.GetServicePerformanceReportAsync(period));
        }

        [HttpGet("service-requests-summary")]
        public async Task<IActionResult> GetServiceRequestsSummary()
        {
            try
            {
                var result = await _reportService.GetServiceRequestsSummaryAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
