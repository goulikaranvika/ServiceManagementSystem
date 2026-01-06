using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ServiceManagement.API.Models
{
    public class ServiceRequest
    {
        [Key]
        public int RequestId { get; set; }

        // CUSTOMER WHO RAISED THE REQUEST
        [Required]
        public int CustomerId { get; set; }

        [ForeignKey(nameof(CustomerId))]
        public User Customer { get; set; } = null!;

        // SERVICE REQUESTED
        [Required]
        public int ServiceId { get; set; }

        [ForeignKey(nameof(ServiceId))]
        public Service Service { get; set; } = null!;

        [MaxLength(150)]
        public string? IssueTitle { get; set; }

        [Required]
        public string IssueDescription { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Priority { get; set; } = "Medium";
        // Low, Medium, High

        // SERVICE LOCATION (SNAPSHOT)
        [Required]
        public string ServiceAddress { get; set; } = string.Empty;
        [Required]
        public string ServiceCity { get; set; } = string.Empty;
        [Required]
        public string ServicePincode { get; set; } = string.Empty;


        [Required]
        [MaxLength(30)]
        public string Status { get; set; } = "Requested";
        // Requested, Assigned, InProgress, Completed, Closed, Cancelled
        [Required]
        public DateTime CreatedDate { get; set; }= DateTime.UtcNow;
        // DATES
        public DateTime RequestedDate { get; set; } = DateTime.UtcNow;
        public DateTime? ScheduledDate { get; set; }
        public DateTime? CompletedDate { get; set; }
        public DateTime? ClosedDate { get; set; }

        // CANCELLATION DETAILS
        public DateTime? CancelledDate { get; set; }
        public int? CancelledBy { get; set; }
        public string? CancelReason { get; set; }
    }
}

/*Booking flow

Cancellation

Technician assignment

Dashboards

Billing triggers

SLA tracking*/