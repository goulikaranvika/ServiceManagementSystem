using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceManagement.API.Data;
using ServiceManagement.API.DTOs.Feedback;
using ServiceManagement.API.Models;
using Microsoft.EntityFrameworkCore;


namespace ServiceManagement.API.Controllers
{
    [ApiController]
    [Route("api/feedback")]
    [Authorize(Roles = "Customer")]
    public class FeedbackController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FeedbackController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitFeedback(CreateFeedbackDto dto)
        {
            var userId = int.Parse(User.FindFirst("UserId")!.Value);

            var request = await _context.ServiceRequests
                .FirstOrDefaultAsync(r =>
                    r.RequestId == dto.RequestId &&
                    r.CustomerId == userId &&
                    r.Status == "Completed");

            if (request == null)
                return BadRequest("Feedback allowed only after service completion");

            var feedback = new ServiceFeedback
            {
                RequestId = dto.RequestId,
                CustomerId = userId,
                Rating = dto.Rating,
                Comments = dto.Comments,
                CreatedAt = DateTime.UtcNow
            };

            _context.ServiceFeedbacks.Add(feedback);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Feedback submitted successfully" });
        }
    }

}
