namespace ServiceManagement.API.DTOs.Technician
{
    public class TechnicianDto
    {
        public int TechnicianId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        
        public bool IsAvailable { get; set; }
    }
}

