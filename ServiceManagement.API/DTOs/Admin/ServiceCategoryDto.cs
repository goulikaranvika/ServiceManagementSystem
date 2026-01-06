namespace ServiceManagement.API.DTOs.Admin{

public class CreateServiceCategoryDto
{
    public string CategoryName { get; set; } = string.Empty;
    public string? Description { get; set; }
   
}
}