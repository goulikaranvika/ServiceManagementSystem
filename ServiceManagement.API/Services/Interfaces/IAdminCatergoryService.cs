using ServiceManagement.API.DTOs.Admin;
using ServiceManagement.API.Models;

namespace ServiceManagement.API.Services.Interfaces
{
    public interface IAdminCategoryService
    {
        // Categories
        Task<List<ServiceCategory>> GetCategoriesAsync();
        Task<ServiceCategory> CreateCategoryAsync(CreateServiceCategoryDto dto);
        Task<ServiceCategory> UpdateCategoryAsync(int id, UpdateServiceCategoryDto dto);
        Task DeleteCategoryAsync(int id);

        // Services
        Task<List<Service>> GetServicesAsync();
        Task<Service> CreateServiceAsync(CreateServiceDto dto);
        Task<Service> UpdateServiceAsync(int id, UpdateServiceDto dto);
        Task DeleteServiceAsync(int id);
    }
}
