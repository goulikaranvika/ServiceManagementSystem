using ServiceManagement.API.DTOs.ServiceRequest;

namespace ServiceManagement.API.Services.Interfaces
{
    public interface IServiceRequestService
    {
        Task CreateRequestAsync(int userId, CreateServiceRequestDto dto);

        Task<List<ServiceRequestResponseDto>> GetMyRequestsAsync(int userId);

        Task CancelRequestAsync(int requestId, int userId, string reason);
    }
}
