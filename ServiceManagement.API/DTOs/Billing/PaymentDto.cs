using System.ComponentModel.DataAnnotations;

namespace ServiceManagement.API.DTOs.Billing
{
    public class PaymentDto
    {
        [Required]
        public int InvoiceId { get; set; }

        [Required]
        public decimal PaidAmount { get; set; }

        [Required]
        [MaxLength(30)]
        public string PaymentMode { get; set; } = string.Empty;
        // UPI, Card, Cash, NetBanking
    }
}
