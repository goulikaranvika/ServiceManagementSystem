// DTOs/Admin/UserListDto.cs
public class UserListDto
{
    public int UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public RoleDto Role { get; set; } = new();
    public bool IsActive { get; set; }
}

public class RoleDto
{
    public string RoleName { get; set; } = string.Empty;
}

