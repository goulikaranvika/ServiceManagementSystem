using Microsoft.EntityFrameworkCore;
using ServiceManagement.API.Data;
using ServiceManagement.API.DTOs.Feedback;
using ServiceManagement.API.Models;
using ServiceManagement.API.Services.Interfaces;

namespace ServiceManagement.API.Services.Implementations
{
    public class FeedbackService : IFeedbackService
    {
        private readonly AppDbContext _context;

        public FeedbackService(AppDbContext context)
        {
            _context = context;
        }

        public async Task SubmitFeedbackAsync(int customerId, CreateFeedbackDto dto)
        {
            // Validate service request ownership & status
            var request = await _context.ServiceRequests
                .FirstOrDefaultAsync(r =>
                    r.RequestId == dto.RequestId &&
                    r.CustomerId == customerId &&
                    r.Status == "Completed");

            if (request == null)
                throw new Exception("Feedback can be submitted only after service completion");

            // Prevent duplicate feedback
            var alreadyExists = await _context.ServiceFeedbacks
                .AnyAsync(f => f.RequestId == dto.RequestId);

            if (alreadyExists)
                throw new Exception("Feedback already submitted for this request");

            // Create feedback
            var feedback = new ServiceFeedback
            {
                RequestId = dto.RequestId,
                CustomerId = customerId,
                Rating = dto.Rating,
                Comments = dto.Comments,
                CreatedAt = DateTime.UtcNow
            };

            _context.ServiceFeedbacks.Add(feedback);
            await _context.SaveChangesAsync();
        }
    }
}
