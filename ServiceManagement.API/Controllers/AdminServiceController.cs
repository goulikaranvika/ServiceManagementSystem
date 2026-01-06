using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceManagement.API.DTOs.Admin;
using ServiceManagement.API.Services.Interfaces;

namespace ServiceManagement.API.Controllers
{
    [ApiController]
    [Route("api/admin/services")]
    [Authorize(Roles = "Admin")]
    public class AdminServiceController : ControllerBase
    {
        private readonly IAdminCategoryService _adminCategoryService;
        private readonly ILogger<AdminServiceController> _logger;

        public AdminServiceController(
            IAdminCategoryService adminCategoryService,
            ILogger<AdminServiceController> logger)
        {
            _adminCategoryService = adminCategoryService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetServices()
        {
            try
            {
                var services = await _adminCategoryService.GetServicesAsync();
                return Ok(services);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving services");
                return StatusCode(500, new { message = "An error occurred while retrieving services" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateServiceDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var service = await _adminCategoryService.CreateServiceAsync(dto);
                return Created($"api/admin/services/{service.ServiceId}", service);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Validation error while creating service: {ServiceName}", dto?.ServiceName);
                return BadRequest(new { message = ex.Message });
            }
            catch (ArgumentNullException ex)
            {
                _logger.LogWarning(ex, "Null argument provided while creating service");
                return BadRequest(new { message = "Invalid request data" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating service: {ServiceName}", dto?.ServiceName);
                return StatusCode(500, new { message = "An error occurred while creating the service" });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateServiceDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var service = await _adminCategoryService.UpdateServiceAsync(id, dto);
                return Ok(service);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Validation error while updating service with ID {ServiceId}: {ServiceName}", id, dto?.ServiceName);
                return BadRequest(new { message = ex.Message });
            }
            catch (ArgumentNullException ex)
            {
                _logger.LogWarning(ex, "Null argument provided while updating service with ID {ServiceId}", id);
                return BadRequest(new { message = "Invalid request data" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating service with ID {ServiceId}: {ServiceName}", id, dto?.ServiceName);
                return StatusCode(500, new { message = "An error occurred while updating the service" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _adminCategoryService.DeleteServiceAsync(id);
                return Ok(new { message = "Service deleted successfully" });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Validation error while deleting service with ID {ServiceId}", id);
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting service with ID {ServiceId}", id);
                return StatusCode(500, new { message = "An error occurred while deleting the service" });
            }
        }
    }
}
