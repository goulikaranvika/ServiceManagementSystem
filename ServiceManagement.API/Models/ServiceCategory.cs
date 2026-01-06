using System.ComponentModel.DataAnnotations;

namespace ServiceManagement.API.Models
{
    public class ServiceCategory
    {
        [Key]
        public int CategoryId { get; set; }

        [Required]
        [MaxLength(100)]
        public string CategoryName { get; set; } = string.Empty;

        [MaxLength(255)]
      
        public string? Description { get; set; }
       
        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Property,One ServiceCategory → Many Services

        public ICollection<Service> Services { get; set; } = new List<Service>();
    }
}
//the icollection line help the ef manage relationships without duplicate data