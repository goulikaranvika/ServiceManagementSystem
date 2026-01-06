using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceManagement.API.Services.Interfaces;
using System.Security.Claims;

namespace ServiceManagement.API.Controllers
{
    [ApiController]
    [Route("api/notifications")]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyNotifications()
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            return Ok(await _notificationService.GetUserNotificationsAsync(userId));
        }

        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount()
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            return Ok(new { count = await _notificationService.GetUnreadCountAsync(userId) });
        }

        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            await _notificationService.MarkAsReadAsync(id, userId);
            return Ok();
        }
    }
}
