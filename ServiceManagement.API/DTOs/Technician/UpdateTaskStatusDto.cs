using System.ComponentModel.DataAnnotations;

namespace ServiceManagement.API.DTOs.Technician
{
    public class UpdateTaskStatusDto
    {
       
        
        public int AssignmentId { get; set; }
        public string Status { get; set; } = string.Empty;
        // Accepted, InProgress, Completed
    }
}
