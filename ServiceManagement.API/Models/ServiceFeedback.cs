using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ServiceManagement.API.Models
{
    public class ServiceFeedback
    {
        [Key]
        public int FeedbackId { get; set; }

        // LINK TO SERVICE REQUEST
        [Required]
        public int RequestId { get; set; }

        [ForeignKey(nameof(RequestId))]
        public ServiceRequest ServiceRequest { get; set; } = null!;

        // CUSTOMER WHO GAVE FEEDBACK
        [Required]
        public int CustomerId { get; set; }

        [ForeignKey(nameof(CustomerId))]
        public User Customer { get; set; } = null!;

        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }

        [MaxLength(255)]
        public string? Comments { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
