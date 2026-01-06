using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceManagement.API.DTOs.Billing;
using ServiceManagement.API.Services.Interfaces;
using System.Security.Claims;

namespace ServiceManagement.API.Controllers
{
    [ApiController]
    [Route("api/billing")]
    [Authorize]
    public class BillingController : ControllerBase
    {
        private readonly IBillingService _billingService;

        public BillingController(IBillingService billingService)
        {
            _billingService = billingService;
        }

        [HttpPost("generate/{requestId}")]
        [Authorize(Roles = "ServiceManager")]
        public async Task<IActionResult> GenerateInvoice(int requestId)
        {
            return Ok(await _billingService.GenerateInvoiceAsync(requestId));
        }

        [HttpGet("request/{requestId}")]
        public async Task<IActionResult> GetInvoice(int requestId)
        {
            return Ok(await _billingService.GetInvoiceByRequestAsync(requestId));
        }

        [HttpPost("pay")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> Pay(PaymentDto dto)
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            await _billingService.ConfirmPaymentAsync(dto, userId);
            return Ok(new { message = "Payment confirmed successfully" });
        }

        [HttpGet("invoices")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> GetMyInvoices()
        {
            int customerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            return Ok(await _billingService.GetCustomerInvoicesAsync(customerId));
        }

        [HttpGet("all-invoices")]
        [Authorize(Roles = "Admin,ServiceManager")]
        public async Task<IActionResult> GetAllInvoices()
        {
            return Ok(await _billingService.GetAllInvoicesAsync());
        }

        [HttpGet("payments")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> GetMyPayments()
        {
            int customerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            return Ok(await _billingService.GetCustomerPaymentsAsync(customerId));
        }

        [HttpGet("payments/stats")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> GetPaymentStats()
        {
            int customerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            return Ok(await _billingService.GetCustomerPaymentStatsAsync(customerId));
        }
    }
}

