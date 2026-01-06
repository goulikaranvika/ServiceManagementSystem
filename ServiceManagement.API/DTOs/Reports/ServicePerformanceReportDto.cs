namespace ServiceManagement.API.DTOs.Reports
{
    public class ServicePerformanceReportDto
    {
        public int TotalServices { get; set; }
        public int TotalRequests { get; set; }
        public double AvgRating { get; set; }
        public double AvgCompletionTime { get; set; }
        public List<ServicePerformanceItemDto> ServicePerformance { get; set; } = new();
        public List<ServicePerformanceItemDto> PopularServices { get; set; } = new();
    }

    public class ServicePerformanceItemDto
    {
        public string ServiceName { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public int RequestCount { get; set; }
        public int CompletedCount { get; set; }
        public double CompletionRate { get; set; } // Percentage
        public double AvgRating { get; set; }
        public decimal Revenue { get; set; }
    }
}
