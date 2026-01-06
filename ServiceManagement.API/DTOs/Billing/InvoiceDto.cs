namespace ServiceManagement.API.DTOs.Billing
{
    public class InvoiceDto
    {
        public int InvoiceId { get; set; }

        public int RequestId { get; set; }

        public string InvoiceNumber { get; set; } = string.Empty;

        public DateTime InvoiceDate { get; set; }

        public decimal SubTotal { get; set; }

        public decimal TaxAmount { get; set; }

        public decimal TotalAmount { get; set; }

        public string PaymentStatus { get; set; } = string.Empty;
        // Pending, Paid
    }
}
