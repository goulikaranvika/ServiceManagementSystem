namespace ServiceManagement.API.DTOs.Feedback
{
    public class CreateFeedbackDto
    {
        public int RequestId { get; set; }
        public int Rating { get; set; } // 1–5
        public string? Comments { get; set; }
    }
}
