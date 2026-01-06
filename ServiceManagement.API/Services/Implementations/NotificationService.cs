using Microsoft.EntityFrameworkCore;
using ServiceManagement.API.Data;
using ServiceManagement.API.Models;
using ServiceManagement.API.Services.Interfaces;

namespace ServiceManagement.API.Services.Implementations
{
    public class NotificationService : INotificationService
    {
        private readonly AppDbContext _context;

        public NotificationService(AppDbContext context)
        {
            _context = context;
        }

        public async Task CreateNotificationAsync(int userId, string title, string message, string type)
        {
            var notification = new Notification
            {
                UserId = userId,
                Title = title,
                Message = message,
                NotificationType = "InApp"
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }

        public async Task<List<object>> GetUserNotificationsAsync(int userId)
        {
            return await _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new
                {
                    n.NotificationId,
                    n.Title,
                    n.Message,
                    Type = n.NotificationType,  // Frontend expects 'type'
                    n.IsRead,
                    CreatedDate = n.CreatedAt    // Frontend expects 'createdDate'
                })
                .ToListAsync()
                .ContinueWith(t => t.Result.Cast<object>().ToList());
        }

        public async Task MarkAsReadAsync(int notificationId, int userId)
        {
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.NotificationId == notificationId && n.UserId == userId);

            if (notification != null)
            {
                notification.IsRead = true;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<int> GetUnreadCountAsync(int userId)
        {
            return await _context.Notifications
                .CountAsync(n => n.UserId == userId && !n.IsRead);
        }
    }
}
