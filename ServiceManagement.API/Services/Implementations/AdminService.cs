using Microsoft.EntityFrameworkCore;
using ServiceManagement.API.Data;
using ServiceManagement.API.DTOs.Admin;
using ServiceManagement.API.Services.Interfaces;

namespace ServiceManagement.API.Services.Implementations
{
    public class AdminService : IAdminService
    {
        private readonly AppDbContext _context;

        public AdminService(AppDbContext context)
        {
            _context = context;
        }

        // =========================
        // GET ALL USERS
        // =========================
      // Services/Implementations/AdminService.cs - Update GetAllUsersAsync method
public async Task<List<UserListDto>> GetAllUsersAsync()
{
    return await _context.Users
        .Include(u => u.Role)
        .Select(u => new UserListDto
        {
            UserId = u.UserId,
            FullName = u.FullName,
            Email = u.Email,
            Role = new RoleDto { RoleName = u.Role.RoleName },
            IsActive = u.IsActive
        })
        .ToListAsync();
}


        // =========================
        // UPDATE USER ROLE
        // =========================
        public async Task UpdateUserRoleAsync(int userId, int roleId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new Exception("User not found");

            var roleExists = await _context.Roles.AnyAsync(r => r.RoleId == roleId);
            if (!roleExists)
                throw new Exception("Invalid role");

            user.RoleId = roleId;
            await _context.SaveChangesAsync();
        }
        public async Task AssignRoleAsync(int userId, int roleId)
        {
            var user = await _context.Users.FindAsync(userId)
                ?? throw new Exception("User not found");

            var roleExists = await _context.Roles.AnyAsync(r => r.RoleId == roleId);
            if (!roleExists)
                throw new Exception("Invalid role");

            user.RoleId = roleId;
            await _context.SaveChangesAsync();
        }

        // =========================
        // ACTIVATE / DEACTIVATE USER
        // =========================
        public async Task ToggleUserStatusAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new Exception("User not found");

            user.IsActive = !user.IsActive;
            await _context.SaveChangesAsync();
        }
    }
}
