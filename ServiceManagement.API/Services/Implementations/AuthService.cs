using Microsoft.EntityFrameworkCore;
using ServiceManagement.API.Data;
using ServiceManagement.API.DTOs.Auth;
using ServiceManagement.API.Helpers;
using ServiceManagement.API.Models;
using ServiceManagement.API.Services.Interfaces;

namespace ServiceManagement.API.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<object> RegisterAsync(RegisterDto registerDto)
        {
            // Check if email already exists
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
            {
                throw new Exception("Email already registered");
            }

            // Assign CUSTOMER role by default
            var customerRole = await _context.Roles
                .FirstOrDefaultAsync(r => r.RoleName == "Customer");

            if (customerRole == null)
            {
                throw new Exception("Customer role not found");
            }

            var user = new User
            {
                FullName = registerDto.FullName,
                Email = registerDto.Email,
                PasswordHash = PasswordHasher.HashPassword(registerDto.Password),
                PhoneNumber = registerDto.PhoneNumber ?? "",
                RoleId = customerRole.RoleId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new
            {
                message = "Registration successful. Please login."
            };
        }

        public async Task<object> LoginAsync(LoginDto loginDto)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null)
            {
                throw new Exception("User not found . please register first");
            }

            if (!PasswordHasher.VerifyPassword(loginDto.Password, user.PasswordHash))
            {
                throw new Exception("Invalid email or password");
            }

            if (!user.IsActive)
            {
                throw new Exception("Account is deactivated");
            }

            var token = JwtTokenHelper.GenerateToken(user, _configuration);

            return new
            {
                token = token,
                user = new
                {
                    userId = user.UserId,
                    fullName = user.FullName,
                    email = user.Email,
                    phoneNumber = user.PhoneNumber,
                    roleId = user.RoleId,
                    role = new
                    {
                        roleId = user.Role.RoleId,
                        roleName = user.Role.RoleName
                    },
                    isActive = user.IsActive,
                    createdAt = user.CreatedAt
                },
                message = "Login successful"
            };
        }
    }
}

