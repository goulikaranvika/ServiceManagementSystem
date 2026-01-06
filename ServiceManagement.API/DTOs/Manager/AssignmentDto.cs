namespace ServiceManagement.API.DTOs.Manager
{
    public class AssignmentDto
    {
        public int AssignmentId { get; set; }
        public int RequestId { get; set; }
        public int TechnicianId { get; set; }
        public string TechnicianName { get; set; } = string.Empty;
        public string ServiceName { get; set; } = string.Empty;
        public string WorkStatus { get; set; } = string.Empty;
        public DateTime AssignedDate { get; set; }
        public string CustomerName { get; set; } = string.Empty;
    }
}
