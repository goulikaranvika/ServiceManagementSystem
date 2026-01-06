namespace ServiceManagement.API.Services.Interfaces
{
    public interface INotificationService
    {
        Task CreateNotificationAsync(int userId, string title, string message, string type);
        Task<List<object>> GetUserNotificationsAsync(int userId);
        Task MarkAsReadAsync(int notificationId, int userId);
        Task<int> GetUnreadCountAsync(int userId);
    }
}
