namespace ServiceManagement.API.DTOs.ServiceRequest
{
    public class ServiceRequestResponseDto
    {
        public int RequestId { get; set; }

        public string ServiceName { get; set; } = string.Empty;

        public string CategoryName { get; set; } = string.Empty;

       

        public string CustomerName { get; set; } = string.Empty;

        public string IssueDescription { get; set; } = string.Empty;
        // Request details
        public string Priority { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;

        public DateTime? ScheduledDate { get; set; }

        public DateTime CreatedDate { get; set; }
        public string ServiceAddress { get; set; } = string.Empty;
        public string ServiceCity { get; set; } = string.Empty;
        public string ServicePincode { get; set; } = string.Empty;

        // Technician Information
        public string? TechnicianName { get; set; }
        public string? TechnicianPhone { get; set; }
        public string? TechnicianEmail { get; set; }

        // Cancellation Details
        public string? CancelReason { get; set; }
        public DateTime? CancelledDate { get; set; }
    }
}