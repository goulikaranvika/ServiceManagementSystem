namespace ServiceManagement.API.DTOs.Technician
{
    public class TechnicianPerformanceDto
    {
        public int TechnicianId { get; set; }

        public string TechnicianName { get; set; } = string.Empty;

        public int TotalAssignedTasks { get; set; }

        public int CompletedTasks { get; set; }

        public int InProgressTasks { get; set; }
        public double AverageCompletionHours { get; set; }

        public double SLACompliancePercentage { get; set; }

        public double AverageRating { get; set; }

        public List<TechnicianFeedbackDto> RecentFeedbacks { get; set; } = new();
    }

    public class TechnicianFeedbackDto
    {
        public int FeedbackId { get; set; }
        public int Rating { get; set; }
        public string Comments { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string ServiceName { get; set; } = string.Empty;
    }
}