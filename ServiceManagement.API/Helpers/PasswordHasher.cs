using BCrypt.Net;
using Org.BouncyCastle.Crypto.Generators;

namespace ServiceManagement.API.Helpers
{
    public static class PasswordHasher
    {
        // Hash password before saving to DB
        public static string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        // Verify password during login
        public static bool VerifyPassword(string password, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }
    }
}
