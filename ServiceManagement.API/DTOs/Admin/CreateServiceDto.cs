
namespace ServiceManagement.API.DTOs.Admin{
public class CreateServiceDto
{
    public string ServiceName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int CategoryId { get; set; }
  
    public decimal BasePrice { get; set; }
    public int SLAHours { get; set; }
}
}