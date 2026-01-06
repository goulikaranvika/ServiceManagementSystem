using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ServiceManagement.API.Models
{
    public class Service
    {
        [Key]
        public int ServiceId { get; set; }

        [Required]
        [MaxLength(150)]
        public string ServiceName { get; set; } = string.Empty;

        [MaxLength(255)]
        public string? Description { get; set; }

        [Required]
        public int CategoryId { get; set; }

        [ForeignKey(nameof(CategoryId))]
        public ServiceCategory Category { get; set; } = null!;

       
        [Required]
        [Range(0, double.MaxValue)]
        public decimal BasePrice { get; set; }

        [Required]
        public int SLAHours { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
