using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ServiceManagement.API.Models;

namespace ServiceManagement.API.Helpers
{
    public static class JwtTokenHelper
    {
        public static string GenerateToken(User user, IConfiguration configuration)
        {
            var claims = new[]
            {
        new Claim("UserId", user.UserId.ToString()),
        new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()), // Add this
        new Claim(ClaimTypes.Name, user.FullName),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, user.Role.RoleName)
    };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!)
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: configuration["Jwt:Issuer"],
                audience: configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
