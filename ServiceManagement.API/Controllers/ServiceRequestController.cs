using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceManagement.API.DTOs.ServiceRequest;
using ServiceManagement.API.Services.Interfaces;
using System.Security.Claims;

namespace ServiceManagement.API.Controllers
{
    [ApiController]
    [Route("api/servicerequests")]
    [Authorize(Roles = "Customer")]
    public class ServiceRequestController : ControllerBase
    {
        private readonly IServiceRequestService _serviceRequestService;

        public ServiceRequestController(IServiceRequestService serviceRequestService)
        {
            _serviceRequestService = serviceRequestService;
        }

        // =========================
        // CREATE REQUEST
        // =========================
        // Add this method to ServiceRequestController
        [HttpGet("stats")]
        public async Task<IActionResult> GetRequestStats()
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var requests = await _serviceRequestService.GetMyRequestsAsync(userId);

            var stats = new
            {
                TotalRequests = requests.Count,
                PendingRequests = requests.Count(r => r.Status != "Completed" && r.Status != "Cancelled"),
                CompletedRequests = requests.Count(r => r.Status == "Completed")
            };

            return Ok(stats);
        }


        [HttpPost]
        public async Task<IActionResult> Create(CreateServiceRequestDto dto)
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            await _serviceRequestService.CreateRequestAsync(userId, dto);
            return Ok(new { message = "Service request created successfully" });
        }

        // =========================
        // GET MY REQUESTS
        // =========================
        [HttpGet("my")]
        public async Task<IActionResult> GetMyRequests()
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            return Ok(await _serviceRequestService.GetMyRequestsAsync(userId));
        }

        // =========================
        // CANCEL REQUEST
        // =========================
        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> Cancel(int id, CancelServiceRequestDto dto)
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            await _serviceRequestService.CancelRequestAsync(id, userId, dto.CancelReason);
            return Ok(new { message = "Service request cancelled" });
        }
    }
}
