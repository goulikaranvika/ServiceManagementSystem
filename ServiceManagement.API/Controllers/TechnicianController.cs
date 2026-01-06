using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServiceManagement.API.DTOs.Technician;
using ServiceManagement.API.Services.Interfaces;
using System.Security.Claims;

namespace ServiceManagement.API.Controllers
{
    [ApiController]
    [Route("api/technician")]
    [Authorize(Roles = "Technician")]
    public class TechnicianController : ControllerBase
    {
        private readonly ITechnicianService _technicianService;

        public TechnicianController(ITechnicianService technicianService)
        {
            _technicianService = technicianService;
        }
        [HttpGet("tasks")]
        public async Task<IActionResult> GetMyTasks()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int technicianId))
            {
                return BadRequest(new { message = "Invalid user token" });
            }

            var result = await _technicianService.GetTechnicianTasksAsync(technicianId);
            return Ok(result);
        }

        [HttpPut("update-task-status")]
        public async Task<IActionResult> UpdateMyTaskStatus([FromBody] UpdateTaskStatusDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int technicianId))
            {
                return BadRequest(new { message = "Invalid user token" });
            }

            await _technicianService.UpdateTaskStatusAsync(dto.AssignmentId, dto.Status, technicianId);
            return Ok(new { message = "Task status updated successfully" });
        }

        [HttpGet("my-performance")]
        public async Task<IActionResult> GetMyPerformance()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int technicianId))
            {
                return BadRequest(new { message = "Invalid user token" });
            }

            var allPerformance = await _technicianService.GetTechnicianPerformanceAsync();
            var myPerformance = allPerformance.FirstOrDefault(p => p.TechnicianId == technicianId);

            if (myPerformance == null)
                return NotFound(new { message = "Performance data not found" });

            return Ok(myPerformance);
        }

        // Add this simple test method to TechnicianController.cs

        [HttpGet("feedback")]
        public async Task<IActionResult> GetMyFeedback()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int technicianId))
                {
                    return BadRequest(new { message = "Invalid user token" });
                }

                var result = await _technicianService.GetTechnicianFeedbackAsync(technicianId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }



    }
}
