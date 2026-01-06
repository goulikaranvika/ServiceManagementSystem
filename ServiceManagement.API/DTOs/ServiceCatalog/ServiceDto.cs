namespace ServiceManagement.API.DTOs.ServiceCatalog
{
    public class ServiceDto
    {
        public int ServiceId { get; set; }

        public string ServiceName { get; set; } = string.Empty;

        public decimal BasePrice { get; set; }

        public int SLAHours { get; set; }
    }
}
