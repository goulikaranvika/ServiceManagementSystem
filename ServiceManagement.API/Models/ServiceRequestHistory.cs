using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ServiceManagement.API.Models
{
    public class ServiceRequestHistory
    {
        [Key]
        public int HistoryId { get; set; }

        [Required]
        public int RequestId { get; set; }

        [ForeignKey(nameof(RequestId))]
        public ServiceRequest ServiceRequest { get; set; } = null!;

        [Required]
        [MaxLength(30)]
        public string OldStatus { get; set; } = string.Empty;

        [Required]
        [MaxLength(30)]
        public string NewStatus { get; set; } = string.Empty;

        [Required]
        public int ChangedBy { get; set; }

        [ForeignKey(nameof(ChangedBy))]
        public User ChangedByUser { get; set; } = null!;

        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

        [MaxLength(255)]
        public string? Remarks { get; set; }
    }
}
