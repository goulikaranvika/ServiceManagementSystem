using Microsoft.EntityFrameworkCore;
using ServiceManagement.API.Data;
using ServiceManagement.API.DTOs.Billing;
using ServiceManagement.API.Models;
using ServiceManagement.API.Services.Interfaces;

namespace ServiceManagement.API.Services.Implementations
{
    public class BillingService : IBillingService
    {
        private readonly AppDbContext _context;
        private readonly INotificationService _notificationService;

        public BillingService(AppDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        public async Task<InvoiceDto> GenerateInvoiceAsync(int requestId)
        {
            var request = await _context.ServiceRequests
                .Include(r => r.Service)
                .FirstOrDefaultAsync(r => r.RequestId == requestId);

            if (request == null)
                throw new Exception("Service request not found");

            if (request.Status != "Completed")
                throw new Exception("Invoice can be generated only after service completion");

            var existingInvoice = await _context.Invoices
                .FirstOrDefaultAsync(i => i.RequestId == requestId);

            if (existingInvoice != null)
            {
                return MapToDto(existingInvoice);
            }

            var subTotal = request.Service.BasePrice;
            var tax = subTotal * 0.18m;
            var total = subTotal + tax;

            var invoice = new Invoice
            {
                RequestId = requestId,
                InvoiceNumber = $"INV-{DateTime.UtcNow.Ticks}",
                InvoiceDate = DateTime.UtcNow,
                SubTotal = subTotal,
                TaxAmount = tax,
                TotalAmount = total,
                PaymentStatus = "Pending"
            };

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            return MapToDto(invoice);
        }

        public async Task<InvoiceDto> GetInvoiceByRequestAsync(int requestId)
        {
            var invoice = await _context.Invoices
                .FirstOrDefaultAsync(i => i.RequestId == requestId);

            if (invoice == null)
                throw new Exception("Invoice not found");

            return MapToDto(invoice);
        }

        public async Task ConfirmPaymentAsync(PaymentDto dto, int userId)
        {
            var invoice = await _context.Invoices
                .Include(i => i.ServiceRequest)
                .FirstOrDefaultAsync(i => i.InvoiceId == dto.InvoiceId);

            if (invoice == null)
                throw new Exception("Invoice not found");

            if (invoice.PaymentStatus == "Paid")
                throw new Exception("Invoice already paid");

            if (dto.PaidAmount != invoice.TotalAmount)
                throw new Exception("Paid amount does not match invoice total");

            var payment = new Payment
            {
                InvoiceId = dto.InvoiceId,
                PaidAmount = dto.PaidAmount,
                PaymentMode = dto.PaymentMode,
                PaymentDate = DateTime.UtcNow,
                PaidBy = userId
            };

            invoice.PaymentStatus = "Paid";

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            // Notify customer about successful payment
            await _notificationService.CreateNotificationAsync(
                userId,
                "Payment Successful",
                $"Your payment of ${dto.PaidAmount:F2} for Invoice #{invoice.InvoiceNumber} has been processed successfully",
                "PaymentSuccess"
            );
        }

        public async Task<List<object>> GetCustomerInvoicesAsync(int customerId)
        {
            var invoices = await _context.Invoices
                .Include(i => i.ServiceRequest)
                    .ThenInclude(r => r.Service)
                .Where(i => i.ServiceRequest.CustomerId == customerId)
                .Select(i => new
                {
                    i.InvoiceId,
                    i.RequestId,
                    i.InvoiceNumber,
                    i.InvoiceDate,
                    i.SubTotal,
                    i.TaxAmount,
                    i.TotalAmount,
                    i.PaymentStatus,
                    ServiceName = i.ServiceRequest.Service.ServiceName
                })
                .ToListAsync();

            return invoices.Cast<object>().ToList();
        }

        public async Task<List<object>> GetAllInvoicesAsync()
        {
            var invoices = await _context.Invoices
                .Include(i => i.ServiceRequest)
                    .ThenInclude(r => r.Service)
                .Include(i => i.ServiceRequest)
                    .ThenInclude(r => r.Customer)
                .Select(i => new
                {
                    i.InvoiceId,
                    i.RequestId,
                    i.InvoiceNumber,
                    i.InvoiceDate,
                    i.SubTotal,
                    i.TaxAmount,
                    i.TotalAmount,
                    i.PaymentStatus,
                    ServiceName = i.ServiceRequest.Service.ServiceName,
                    CustomerName = i.ServiceRequest.Customer.FullName
                })
                .ToListAsync();

            return invoices.Cast<object>().ToList();
        }

        public async Task<List<object>> GetCustomerPaymentsAsync(int customerId)
        {
            var payments = await _context.Payments
                .Include(p => p.Invoice)
                    .ThenInclude(i => i.ServiceRequest)
                .Where(p => p.PaidBy == customerId)
                .Select(p => new
                {
                    PaymentId = p.PaymentId,
                    InvoiceId = p.InvoiceId,
                    Amount = p.PaidAmount,
                    PaymentMethod = p.PaymentMode,
                    Status = "Completed",
                    PaymentDate = p.PaymentDate,
                    TransactionId = $"TXN-{p.PaymentId}"
                })
                .ToListAsync();

            return payments.Cast<object>().ToList();
        }

        public async Task<object> GetCustomerPaymentStatsAsync(int customerId)
        {
            var payments = await _context.Payments
                .Where(p => p.PaidBy == customerId)
                .ToListAsync();

            return new
            {
                TotalPayments = payments.Count,
                TotalPaidAmount = payments.Sum(p => p.PaidAmount),
                SuccessfulPayments = payments.Count
            };
        }

        private static InvoiceDto MapToDto(Invoice invoice)
        {
            return new InvoiceDto
            {
                InvoiceId = invoice.InvoiceId,
                RequestId = invoice.RequestId,
                InvoiceNumber = invoice.InvoiceNumber,
                InvoiceDate = invoice.InvoiceDate,
                SubTotal = invoice.SubTotal,
                TaxAmount = invoice.TaxAmount,
                TotalAmount = invoice.TotalAmount,
                PaymentStatus = invoice.PaymentStatus
            };
        }
    }
}

