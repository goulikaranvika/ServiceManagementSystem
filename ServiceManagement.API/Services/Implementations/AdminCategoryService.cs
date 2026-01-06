using Microsoft.EntityFrameworkCore;
using ServiceManagement.API.Data;
using ServiceManagement.API.DTOs.Admin;
using ServiceManagement.API.Models;
using ServiceManagement.API.Services.Interfaces;

namespace ServiceManagement.API.Services.Implementations
{
    public class AdminCategoryService : IAdminCategoryService
    {
        private readonly AppDbContext _context;

        public AdminCategoryService(AppDbContext context)
        {
            _context = context;
        }

        // =======================
        // CATEGORY CRUD
        // =======================

        public async Task<List<ServiceCategory>> GetCategoriesAsync()
            => await _context.ServiceCategories.ToListAsync();

        public async Task<ServiceCategory> CreateCategoryAsync(CreateServiceCategoryDto dto)
        {
            var category = new ServiceCategory
            {
                CategoryName = dto.CategoryName,
                Description = dto.Description
            };

            _context.ServiceCategories.Add(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<ServiceCategory> UpdateCategoryAsync(int id, UpdateServiceCategoryDto dto)
        {
            var category = await _context.ServiceCategories.FindAsync(id)
                ?? throw new Exception("Category not found");

            category.CategoryName = dto.CategoryName;
            category.Description = dto.Description;

            await _context.SaveChangesAsync();
            return category;
        }

        public async Task DeleteCategoryAsync(int id)
        {
            var category = await _context.ServiceCategories.FindAsync(id)
                ?? throw new Exception("Category not found");

            _context.ServiceCategories.Remove(category);
            await _context.SaveChangesAsync();
        }

        // =======================
        // SERVICE CRUD
        // =======================

        public async Task<List<Service>> GetServicesAsync()
            => await _context.Services
                .Include(s => s.Category)
                
                .ToListAsync();

        public async Task<Service> CreateServiceAsync(CreateServiceDto dto)
        {
            // Check for duplicate service name in the same category (case-insensitive)
            var duplicateExists = await _context.Services
                .AnyAsync(s => s.CategoryId == dto.CategoryId && 
                              s.ServiceName.ToLower() == dto.ServiceName.ToLower());
            
            if (duplicateExists)
            {
                throw new Exception($"A service with the name '{dto.ServiceName}' already exists in this category.");
            }

            var service = new Service
            {
                ServiceName = dto.ServiceName,
                CategoryId = dto.CategoryId,
                
                BasePrice = dto.BasePrice,
                SLAHours = dto.SLAHours,
                Description = dto.Description
            };

            _context.Services.Add(service);
            await _context.SaveChangesAsync();
            return service;
        }

        public async Task<Service> UpdateServiceAsync(int id, UpdateServiceDto dto)
        {
            var service = await _context.Services.FindAsync(id)
                ?? throw new Exception("Service not found");

            // Check for duplicate service name in the same category (case-insensitive)
            // Exclude the current service being updated
            var duplicateExists = await _context.Services
                .AnyAsync(s => s.ServiceId != id && 
                              s.CategoryId == dto.CategoryId && 
                              s.ServiceName.ToLower() == dto.ServiceName.ToLower());
            
            if (duplicateExists)
            {
                throw new Exception($"A service with the name '{dto.ServiceName}' already exists in this category.");
            }

            service.ServiceName = dto.ServiceName;
            service.CategoryId = dto.CategoryId;
         
            service.BasePrice = dto.BasePrice;
            service.SLAHours = dto.SLAHours;
            service.Description = dto.Description;
            await _context.SaveChangesAsync();
            return service;
        }

        public async Task DeleteServiceAsync(int id)
        {
            var service = await _context.Services.FindAsync(id)
                ?? throw new Exception("Service not found");

            _context.Services.Remove(service);
            await _context.SaveChangesAsync();
        }
    }
}
