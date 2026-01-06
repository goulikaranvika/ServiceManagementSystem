namespace ServiceManagement.API.DTOs.ServiceRequest
{
    public class ServiceRequestDto
    {
        public int RequestId { get; set; }
        public string ServiceName { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
      
        public string CustomerName { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime? ScheduledDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ServiceAddress { get; set; } = string.Empty;
        public string ServiceCity { get; set; } = string.Empty;
        public string ServicePincode { get; set; } = string.Empty;
    }
}

