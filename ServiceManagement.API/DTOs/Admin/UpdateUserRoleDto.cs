using System.ComponentModel.DataAnnotations;

namespace ServiceManagement.API.DTOs.Admin
{
    public class UpdateUserRoleDto
    {
        [Required]
        public int RoleId { get; set; }
    }
}
