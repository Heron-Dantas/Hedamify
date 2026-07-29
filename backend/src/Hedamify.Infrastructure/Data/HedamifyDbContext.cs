using Hedamify.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Hedamify.Infrastructure.Data;

public class HedamifyDbContext(DbContextOptions<HedamifyDbContext> options) : DbContext(options)
{
    public DbSet<AppUser> Users => Set<AppUser>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductPhoto> ProductPhotos => Set<ProductPhoto>();
    public DbSet<PhotoType> PhotoTypes => Set<PhotoType>();
    public DbSet<GenerationJob> GenerationJobs => Set<GenerationJob>();
    public DbSet<GenerationJobPhotoType> GenerationJobPhotoTypes => Set<GenerationJobPhotoType>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(HedamifyDbContext).Assembly);
    }
}
