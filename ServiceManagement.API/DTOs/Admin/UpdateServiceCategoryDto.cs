namespace ServiceManagement.API.DTOs.Admin{

public class UpdateServiceCategoryDto
{
    public string CategoryName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsApplianceBased { get; set; }
}
}