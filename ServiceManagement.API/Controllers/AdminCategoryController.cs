using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceManagement.API.Data;
using ServiceManagement.API.Models;
using ServiceManagement.API.DTOs.Admin;
using Microsoft.EntityFrameworkCore;

namespace ServiceManagement.API.Controllers
{
    [ApiController]
    [Route("api/admin/categories")]
    [Authorize(Roles = "Admin")]
    public class AdminCategoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminCategoryController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            return Ok(await _context.ServiceCategories.ToListAsync());
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateServiceCategoryDto dto)
        {
            var category = new ServiceCategory
            {
                CategoryName = dto.CategoryName,
                Description = dto.Description,
              
            };

            _context.ServiceCategories.Add(category);
            await _context.SaveChangesAsync();
            return Ok(category);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateServiceCategoryDto dto)
        {
            var category = await _context.ServiceCategories.FindAsync(id);
            if (category == null) return NotFound();

            category.CategoryName = dto.CategoryName;
            category.Description = dto.Description;
            

            await _context.SaveChangesAsync();
            return Ok(category);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.ServiceCategories.FindAsync(id);
            if (category == null) return NotFound();

            _context.ServiceCategories.Remove(category);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
