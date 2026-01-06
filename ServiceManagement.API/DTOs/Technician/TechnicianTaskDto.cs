namespace ServiceManagement.API.DTOs.Technician
{
    public class TechnicianTaskDto
    {
        public int AssignmentId { get; set; }

        public int RequestId { get; set; }

        public string ServiceName { get; set; } = string.Empty;

        public string CategoryName { get; set; } = string.Empty;

       

        public string WorkStatus { get; set; } = string.Empty;
        // Assigned, Accepted, InProgress, Completed

        public DateTime? ScheduledDate { get; set; }

        // SERVICE LOCATION
        public string ServiceAddress { get; set; } = string.Empty;
        public string ServiceCity { get; set; } = string.Empty;
        public string ServicePincode { get; set; } = string.Empty;
        
        public string CustomerPhoneNumber { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
    }
}
