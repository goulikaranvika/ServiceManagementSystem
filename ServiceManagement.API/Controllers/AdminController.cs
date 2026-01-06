using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceManagement.API.DTOs.Admin;
using ServiceManagement.API.Services.Interfaces;

namespace ServiceManagement.API.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        // =========================
        // GET ALL USERS
        // =========================
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _adminService.GetAllUsersAsync();
            return Ok(users);
        }

        // =========================
        // ASSIGN ROLE
        // =========================
        [HttpPut("users/{userId}/role")]
        public async Task<IActionResult> AssignRole(
            int userId,
            [FromBody] UpdateUserRoleDto dto)
        {
            await _adminService.AssignRoleAsync(userId, dto.RoleId);
            return Ok(new { message = "Role assigned successfully" });
        }

        // =========================
        // ACTIVATE / DEACTIVATE USER
        // =========================
        [HttpPut("users/{userId}/toggle-status")]
        public async Task<IActionResult> ToggleStatus(int userId)
        {
            await _adminService.ToggleUserStatusAsync(userId);
            return Ok(new { message = "User status updated" });
        }
    }
}

