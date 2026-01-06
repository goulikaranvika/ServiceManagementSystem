using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceManagement.API.Services.Interfaces;
using ServiceManagement.API.DTOs.Manager;
using System.Security.Claims;

namespace ServiceManagement.API.Controllers
{
    [ApiController]
    [Route("api/manager")]
    [Authorize(Roles = "ServiceManager")]
    public class ManagerController : ControllerBase
    {
        private readonly ITechnicianService _technicianService;

        public ManagerController(ITechnicianService technicianService)
        {
            _technicianService = technicianService;
        }

        // SERVICE REQUESTS
        [HttpGet("service-requests")]
        public async Task<IActionResult> GetAllServiceRequests()
        {
            var result = await _technicianService.GetAllServiceRequestsAsync();
            return Ok(result);
        }

        [HttpGet("service-requests/unassigned")]
        public async Task<IActionResult> GetUnassignedRequests()
        {
            var result = await _technicianService.GetUnassignedServiceRequestsAsync();
            return Ok(result);
        }

        // ASSIGNMENTS
        [HttpGet("assignments")]
        public async Task<IActionResult> GetAssignments()
        {
            var result = await _technicianService.GetAllAssignmentsAsync();
            return Ok(result);
        }

        [HttpPost("assignments")]
        public async Task<IActionResult> AssignTechnician([FromBody] AssignTechnicianDto dto)
        {
            try
            {
                var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

                if (currentUserId == 0)
                    return BadRequest(new { message = "Invalid user token" });

                await _technicianService.AssignTechnicianAsync(dto.RequestId, dto.TechnicianId, currentUserId);
                return Ok(new { message = "Technician assigned successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }



        [HttpPut("assignments/{assignmentId}/status")]
        public async Task<IActionResult> UpdateAssignmentStatus(int assignmentId, [FromBody] UpdateStatusDto dto)
        {
            await _technicianService.UpdateTaskStatusByManagerAsync(assignmentId, dto.Status);
            return Ok(new { message = "Assignment status updated successfully" });
        }

        // TECHNICIANS
        [HttpGet("technicians")]
        public async Task<IActionResult> GetTechnicians()
        {
            var result = await _technicianService.GetAvailableTechniciansAsync();
            return Ok(result);
        }

        [HttpGet("technicians/{technicianId}/tasks")]
        public async Task<IActionResult> GetTechnicianTasks(int technicianId)
        {
            var result = await _technicianService.GetTechnicianTasksAsync(technicianId);
            return Ok(result);
        }

        // PERFORMANCE & REPORTS
        [HttpGet("performance")]
        public async Task<IActionResult> GetTechnicianPerformance()
        {
            var result = await _technicianService.GetTechnicianPerformanceAsync();
            return Ok(result);
        }

        [HttpGet("performance/stats")]
        public async Task<IActionResult> GetPerformanceStats()
        {
            var result = await _technicianService.GetPerformanceStatsAsync();
            return Ok(result);
        }
    }
}

