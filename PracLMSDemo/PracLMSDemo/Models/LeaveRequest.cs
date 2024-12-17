using System.ComponentModel.DataAnnotations;
using static PracLMSDemo.Utility.Sd;

namespace PracLMSDemo.Models
{
    public class LeaveRequest
    {
        [Key]
        public int LeaveId { get; set; }
        public int EmployeeId { get; set; }

        [MaxLength(50)]
        public string EmployeeName { get; set; }

        [MaxLength(50)]
        public string EmployeePhone { get; set; }

        [MaxLength(50)]
        public string ManagerName { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public int TotalDays { get; set; }

        [MaxLength(200)]
        public string ReasonForLeave { get; set; }

        [MaxLength(30)]
        public string Status { get; set; }
    }
}
