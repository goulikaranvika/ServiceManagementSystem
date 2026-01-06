using Microsoft.AspNetCore.Mvc;
using ServiceManagement.API.Services.Interfaces;

namespace ServiceManagement.API.Controllers
{
    [ApiController]
    [Route("api/catalog")]
    public class ServiceCatalogController : ControllerBase
    {
        private readonly IServiceCatalogService _catalogService;

        public ServiceCatalogController(IServiceCatalogService catalogService)
        {
            _catalogService = catalogService;
        }

        // =========================
        // GET CATEGORIES
        // =========================
        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            return Ok(await _catalogService.GetCategoriesAsync());
        }


        // Add this method to ServiceCatalogController
        [HttpGet("categories/{categoryId}/services")]
        public async Task<IActionResult> GetServicesByCategory(int categoryId)
        {
            return Ok(await _catalogService.GetServicesAsync(categoryId, null));
        }

        // =========================
        // GET APPLIANCES
        // =========================
       

        // =========================
        // GET SERVICES
        // =========================
        [HttpGet("services")]
        public async Task<IActionResult> GetServices(
            [FromQuery] int categoryId,
            [FromQuery] int? applianceId)
        {
            return Ok(await _catalogService.GetServicesAsync(categoryId, applianceId));
        }
    }
}
