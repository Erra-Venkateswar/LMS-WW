using Microsoft.EntityFrameworkCore;
using PracLMSDemo.Models;

namespace PracLMSDemo.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<PracLMSDemo.Models.LeaveRequest> LeaveRequest { get; set; } = default!;
    }
}
