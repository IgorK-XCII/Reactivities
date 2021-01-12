using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options) { }
        public DbSet<Value> Values { get; set; }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<UserActivity> UserActivities { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<UserFollowing> Followings { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Value>()
                .HasData(
                    new Value { Id = 1, Name = "Value 101" },
                    new Value { Id = 2, Name = "Value 102" },
                    new Value { Id = 3, Name = "Value 103" }
                );
            builder.Entity<UserActivity>(b =>
            {
                b.HasKey(ua => new { ua.AppUserId, ua.ActivityId });

                b.HasOne(ua => ua.AppUser)
                    .WithMany(u => u.UserActivities)
                    .HasForeignKey(ua => ua.AppUserId);

                b.HasOne(ua => ua.Activity)
                    .WithMany(a => a.UserActivities)
                    .HasForeignKey(ua => ua.ActivityId);
            });

            builder.Entity<UserFollowing>(b =>
            {
                b.HasKey(uf => new { uf.ObserverId, uf.TargetId });

                b.HasOne(u => u.Observer)
                    .WithMany(o => o.Followings)
                    .HasForeignKey(f => f.ObserverId)
                    .OnDelete(DeleteBehavior.Restrict);

                b.HasOne(u => u.Target)
                    .WithMany(t => t.Followers)
                    .HasForeignKey(f => f.TargetId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}