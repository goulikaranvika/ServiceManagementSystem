using ServiceManagement.API.DTOs.Admin;

namespace ServiceManagement.API.Services.Interfaces
{
    public interface IAdminService
    {
        Task<List<UserListDto>> GetAllUsersAsync();
        
        Task UpdateUserRoleAsync(int userId, int roleId);
        Task AssignRoleAsync(int userId, int roleId);
        Task ToggleUserStatusAsync(int userId);
    }
}
