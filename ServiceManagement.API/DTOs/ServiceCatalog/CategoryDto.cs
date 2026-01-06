namespace ServiceManagement.API.DTOs.ServiceCatalog
{
    public class CategoryDto
    {
        public int CategoryId { get; set; }

        public string CategoryName { get; set; } = string.Empty;

        public bool IsApplianceBased { get; set; }
    }
}
