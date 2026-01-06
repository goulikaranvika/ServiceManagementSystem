namespace ServiceManagement.API.DTOs.Manager
{
    public class PerformanceStatsDto
    {
        public int TotalServiceRequests { get; set; }
        public int AssignedRequests { get; set; }
        public int CompletedRequests { get; set; }
        public int InProgressRequests { get; set; }
        public int UnassignedRequests { get; set; }
        public int TotalTechnicians { get; set; }
        public double AverageCompletionTime { get; set; }
    }
}

