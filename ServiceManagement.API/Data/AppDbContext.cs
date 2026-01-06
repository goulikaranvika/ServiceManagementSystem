using Microsoft.EntityFrameworkCore;
using ServiceManagement.API.Models;

namespace ServiceManagement.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        // USERS & ROLES
        public DbSet<Role> Roles => Set<Role>();
        public DbSet<User> Users => Set<User>();

        // MASTER DATA
        public DbSet<ServiceCategory> ServiceCategories => Set<ServiceCategory>();

        public DbSet<Service> Services => Set<Service>();

        // CORE BUSINESS
        public DbSet<ServiceRequest> ServiceRequests => Set<ServiceRequest>();
        public DbSet<ServiceRequestHistory> ServiceRequestHistories => Set<ServiceRequestHistory>();
        public DbSet<TechnicianAssignment> TechnicianAssignments => Set<TechnicianAssignment>();
       

        // FEEDBACK & NOTIFICATION
        public DbSet<ServiceFeedback> ServiceFeedbacks => Set<ServiceFeedback>();
        public DbSet<Notification> Notifications => Set<Notification>();

        // BILLING
        public DbSet<Invoice> Invoices => Set<Invoice>();
        public DbSet<Payment> Payments => Set<Payment>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // UNIQUE USER EMAIL
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // USER → ROLE
            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleId)
                .OnDelete(DeleteBehavior.Restrict);

            // SERVICE → CATEGORY
            modelBuilder.Entity<Service>()
                .HasOne(s => s.Category)
                .WithMany(c => c.Services)
                .HasForeignKey(s => s.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

 


            // SERVICE FEEDBACK → SERVICE REQUEST
            modelBuilder.Entity<ServiceFeedback>()
                .HasOne(sf => sf.ServiceRequest)
                .WithMany()
                .HasForeignKey(sf => sf.RequestId)
                .OnDelete(DeleteBehavior.Cascade);

            // SERVICE FEEDBACK → CUSTOMER (USER)
            // ❌ NO CASCADE to avoid multiple cascade paths
            modelBuilder.Entity<ServiceFeedback>()
                .HasOne(sf => sf.Customer)
                .WithMany()
                .HasForeignKey(sf => sf.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);


            // =========================
            // SERVICE REQUEST HISTORY RULES
            // =========================

            // History deleted when ServiceRequest is deleted
            modelBuilder.Entity<ServiceRequestHistory>()
                .HasOne(h => h.ServiceRequest)
                .WithMany()
                .HasForeignKey(h => h.RequestId)
                .OnDelete(DeleteBehavior.Cascade);

            // History NOT deleted when User is deleted (avoid cascade paths)
            modelBuilder.Entity<ServiceRequestHistory>()
                .HasOne(h => h.ChangedByUser)
                .WithMany()
                .HasForeignKey(h => h.ChangedBy)
                .OnDelete(DeleteBehavior.Restrict);

            // SERVICE REQUEST → CUSTOMER (NO CASCADE)
            modelBuilder.Entity<ServiceRequest>()
                .HasOne(sr => sr.Customer)
                .WithMany()
                .HasForeignKey(sr => sr.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            // SERVICE REQUEST → SERVICE
            modelBuilder.Entity<ServiceRequest>()
                .HasOne(sr => sr.Service)
                .WithMany()
                .HasForeignKey(sr => sr.ServiceId)
                .OnDelete(DeleteBehavior.Restrict);

            // ASSIGNMENT → SERVICE REQUEST (CASCADE OK)
            modelBuilder.Entity<TechnicianAssignment>()
       .HasOne(a => a.ServiceRequest)
       .WithMany()
       .HasForeignKey(a => a.RequestId)
       .OnDelete(DeleteBehavior.Cascade);

            // ASSIGNMENT → TECHNICIAN (NO CASCADE)
            modelBuilder.Entity<TechnicianAssignment>()
                .HasOne(a => a.Technician)
                .WithMany()
                .HasForeignKey(a => a.TechnicianId)
                .OnDelete(DeleteBehavior.Restrict);

            // ADD THIS - ASSIGNMENT → MANAGER (AssignedBy)
            modelBuilder.Entity<TechnicianAssignment>()
                .HasOne(a => a.Manager)
                .WithMany()
                .HasForeignKey(a => a.AssignedBy)
                .OnDelete(DeleteBehavior.Restrict);


            // INVOICE → SERVICE REQUEST
            modelBuilder.Entity<Invoice>()
                .HasOne(i => i.ServiceRequest)
                .WithMany()
                .HasForeignKey(i => i.RequestId)
                .OnDelete(DeleteBehavior.Restrict);

            // PAYMENT → INVOICE (CASCADE OK)
            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Invoice)
                .WithMany()
                .HasForeignKey(p => p.InvoiceId)
                .OnDelete(DeleteBehavior.Cascade);

            // PAYMENT → USER (NO CASCADE)
            modelBuilder.Entity<Payment>()
                .HasOne(p => p.PaidByUser)
                .WithMany()
                .HasForeignKey(p => p.PaidBy)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Notification>()
    .HasOne(n => n.User)
    .WithMany()
    .HasForeignKey(n => n.UserId)
    .OnDelete(DeleteBehavior.Cascade);



        }
    }
}
