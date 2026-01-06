using Microsoft.EntityFrameworkCore;
using ServiceManagement.API.Data;
using ServiceManagement.API.DTOs.ServiceCatalog;
using ServiceManagement.API.Services.Interfaces;

namespace ServiceManagement.API.Services.Implementations
{
    public class ServiceCatalogService : IServiceCatalogService
    {
        private readonly AppDbContext _context;

        public ServiceCatalogService(AppDbContext context)
        {
            _context = context;
        }

        // =========================
        // GET ALL CATEGORIES
        // =========================
        public async Task<List<CategoryDto>> GetCategoriesAsync()
        {
            return await _context.ServiceCategories
                .Where(c => c.IsActive)
                .Select(c => new CategoryDto
                {
                    CategoryId = c.CategoryId,
                    CategoryName = c.CategoryName

                })
                .ToListAsync();
        }

        public async Task<List<ServiceDto>> GetServicesAsync(int categoryId, int? applianceId = null)
        {
            return await _context.Services
                .Where(s => s.CategoryId == categoryId && s.IsActive)
                .Select(s => new ServiceDto
                {
                    ServiceId = s.ServiceId,
                    ServiceName = s.ServiceName,
                    BasePrice = s.BasePrice,
                    SLAHours = s.SLAHours
                })
                .ToListAsync();
        }
        // =========================


        // =========================
        // GET SERVICES
        // =========================
    }
}
