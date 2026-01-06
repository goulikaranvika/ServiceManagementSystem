using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ServiceManagement.API.Models
{
    public class TechnicianAssignment
    {
        [Key]
        public int AssignmentId { get; set; }

        // SERVICE REQUEST 
        [Required]
        public int RequestId { get; set; }

        [ForeignKey(nameof(RequestId))]
        public ServiceRequest ServiceRequest { get; set; } = null!;

        // TECHNICIAN 
        [Required]
        public int TechnicianId { get; set; }

        [ForeignKey(nameof(TechnicianId))]
        public User Technician { get; set; } = null!;

        // MANAGER 
        [Required]
        public int AssignedBy { get; set; }

        [ForeignKey(nameof(AssignedBy))]
        public User Manager { get; set; } = null!;

        // ASSIGNMENT STATUS & DATES
        public DateTime AssignedDate { get; set; } = DateTime.UtcNow;
        public DateTime? AcceptedDate { get; set; }
        public DateTime? CompletedDate { get; set; }

        [Required]
        [MaxLength(30)]
        public string WorkStatus { get; set; } = "Assigned";
        // Assigned, Accepted, InProgress, Completed, Rejected
    }
}
