using System.ComponentModel.DataAnnotations;

namespace ServiceManagement.API.DTOs.ServiceRequest
{
    public class CreateServiceRequestDto
    {
        [Required]
        public int ServiceId { get; set; }
        // Selected after category → appliance → service flow

        [Required]
        [MaxLength(500)]
        public string IssueDescription { get; set; } = string.Empty;
        [Required]
        public string Priority { get; set; } = "Medium";
        [Required]
        public DateTime ScheduledDate { get; set; }
        // User preferred visit date
        [Required]
        [MaxLength(200)]
        public string ServiceAddress { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string ServiceCity { get; set; } = string.Empty;

        [Required]
        [MaxLength(10)]
        public string ServicePincode { get; set; } = string.Empty;
    }
}

