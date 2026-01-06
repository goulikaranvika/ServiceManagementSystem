using ServiceManagement.API.DTOs.ServiceCatalog;

namespace ServiceManagement.API.Services.Interfaces
{
    public interface IServiceCatalogService
    {
        Task<List<CategoryDto>> GetCategoriesAsync();


        Task<List<ServiceDto>> GetServicesAsync(int categoryId, int? applianceId);
    }
}
