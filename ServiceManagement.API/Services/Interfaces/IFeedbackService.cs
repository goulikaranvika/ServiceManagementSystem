using ServiceManagement.API.DTOs.Feedback;

namespace ServiceManagement.API.Services.Interfaces
{
    public interface IFeedbackService
    {
        Task SubmitFeedbackAsync(int customerId, CreateFeedbackDto dto);
    }
}
