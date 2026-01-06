using Microsoft.AspNetCore.Mvc;
using ServiceManagement.API.DTOs.Auth;
using ServiceManagement.API.Services.Interfaces;

namespace ServiceManagement.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // ✅ REGISTER (NO TOKEN HERE)
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            await _authService.RegisterAsync(dto);
            return Ok(new { message = "User registered successfully" });
        }

        // ✅ LOGIN (TOKEN GENERATED HERE)
       [HttpPost("login")]
public async Task<IActionResult> Login(LoginDto dto)
{
    try
    {
        var result = await _authService.LoginAsync(dto);
        return Ok(result); // Return result directly, not wrapped in { token }
    }
    catch (Exception ex)
    {
        return BadRequest(new { message = ex.Message });
    }
}

    }
}
