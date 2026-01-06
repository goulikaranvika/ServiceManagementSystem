using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ServiceManagement.API.Models
{
    public class Payment
    {
        [Key]
        public int PaymentId { get; set; }

        // LINK TO INVOICE
        [Required]
        public int InvoiceId { get; set; }

        [ForeignKey(nameof(InvoiceId))]
        public Invoice Invoice { get; set; } = null!;

        [Required]
        public decimal PaidAmount { get; set; }

        [Required]
        [MaxLength(30)]
        public string PaymentMode { get; set; } = string.Empty;
        // Cash, Card, UPI, NetBanking

        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;

        [Required]
        public int PaidBy { get; set; }

        [ForeignKey(nameof(PaidBy))]
        public User PaidByUser { get; set; } = null!;

        [MaxLength(100)]
        public string? TransactionReference { get; set; }

        public bool IsRefunded { get; set; } = false;
    }
}
