using Hedamify.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Hedamify.Infrastructure.Data.Configurations;

public class GenerationJobConfiguration : IEntityTypeConfiguration<GenerationJob>
{
    public void Configure(EntityTypeBuilder<GenerationJob> builder)
    {
        builder.HasKey(j => j.Id);
        builder.Property(j => j.Status).HasConversion<string>().HasMaxLength(30).IsRequired();

        builder
            .HasOne(j => j.Product)
            .WithMany(p => p.GenerationJobs)
            .HasForeignKey(j => j.ProductId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
