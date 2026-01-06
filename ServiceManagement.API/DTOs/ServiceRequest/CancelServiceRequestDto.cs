using System.ComponentModel.DataAnnotations;

namespace ServiceManagement.API.DTOs.ServiceRequest
{
    public class CancelServiceRequestDto
    {
        [Required]
        [MaxLength(200)]
        public string CancelReason { get; set; } = string.Empty;
    }
}
