using ServiceManagement.API.DTOs.Auth;

namespace ServiceManagement.API.Services.Interfaces
{
    public interface IAuthService
    {
        Task<object> RegisterAsync(RegisterDto registerDto);
        Task<object> LoginAsync(LoginDto loginDto);
    }
}
