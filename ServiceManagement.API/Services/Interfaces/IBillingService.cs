using ServiceManagement.API.DTOs.Billing;

namespace ServiceManagement.API.Services.Interfaces
{
    public interface IBillingService
    {
        Task<InvoiceDto> GenerateInvoiceAsync(int requestId);

        Task<InvoiceDto> GetInvoiceByRequestAsync(int requestId);

        Task ConfirmPaymentAsync(PaymentDto dto, int userId);

        Task<List<object>> GetCustomerInvoicesAsync(int customerId);
        Task<List<object>> GetCustomerPaymentsAsync(int customerId);
        Task<object> GetCustomerPaymentStatsAsync(int customerId);
        Task<List<object>> GetAllInvoicesAsync();


    }
}
