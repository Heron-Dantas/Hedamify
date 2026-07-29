using Hedamify.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Hedamify.Infrastructure.Data.Configurations;

public class GenerationJobPhotoTypeConfiguration : IEntityTypeConfiguration<GenerationJobPhotoType>
{
    public void Configure(EntityTypeBuilder<GenerationJobPhotoType> builder)
    {
        builder.HasKey(i => i.Id);
        builder.Property(i => i.Status).HasConversion<string>().HasMaxLength(30).IsRequired();
        builder.Property(i => i.InstrucaoPersonalizada).HasMaxLength(1000);
        builder.Property(i => i.ResultImageBlobUrl).HasMaxLength(2048);
        builder.Property(i => i.ErrorMessage).HasMaxLength(2000);

        builder
            .HasOne(i => i.GenerationJob)
            .WithMany(j => j.Itens)
            .HasForeignKey(i => i.GenerationJobId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(i => i.PhotoType)
            .WithMany(t => t.GenerationJobPhotoTypes)
            .HasForeignKey(i => i.PhotoTypeId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
