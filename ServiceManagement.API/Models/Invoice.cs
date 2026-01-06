using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ServiceManagement.API.Models
{
    public class Invoice
    {
        [Key]
        public int InvoiceId { get; set; }

        // LINK TO SERVICE REQUEST
        [Required]
        public int RequestId { get; set; }

        [ForeignKey(nameof(RequestId))]
        public ServiceRequest ServiceRequest { get; set; } = null!;

        [Required]
        [MaxLength(50)]
        public string InvoiceNumber { get; set; } = string.Empty;

        public DateTime InvoiceDate { get; set; } = DateTime.UtcNow;

        [Required]
        public decimal SubTotal { get; set; }

        public decimal TaxAmount { get; set; }

        [Required]
        public decimal TotalAmount { get; set; }

        [Required]
        [MaxLength(20)]
        public string PaymentStatus { get; set; } = "Pending";
        // Pending, Paid
    }
}

/* An Invoice says what to pay
A Payment says what was paid

Why separate tables?

Partial payments

Multiple attempts

Refunds (future)*/