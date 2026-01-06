using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ServiceManagement.API.Models
{
    public class Notification
    {
        [Key]
        public int NotificationId { get; set; }

        // USER WHO RECEIVES THE NOTIFICATION
        [Required]
        public int UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public User User { get; set; } = null!;

        [Required]
        [MaxLength(20)]
        public string NotificationType { get; set; } = "InApp";
        // InApp, Email

        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string Message { get; set; } = string.Empty;

        public bool IsRead { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
