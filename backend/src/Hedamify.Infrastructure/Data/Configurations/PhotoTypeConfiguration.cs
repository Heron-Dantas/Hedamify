using Hedamify.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Hedamify.Infrastructure.Data.Configurations;

public class PhotoTypeConfiguration : IEntityTypeConfiguration<PhotoType>
{
    public void Configure(EntityTypeBuilder<PhotoType> builder)
    {
        builder.HasKey(t => t.Id);
        builder.Property(t => t.Codigo).HasMaxLength(50).IsRequired();
        builder.Property(t => t.Nome).HasMaxLength(100).IsRequired();
        builder.Property(t => t.Descricao).HasMaxLength(300).IsRequired();

        builder.HasIndex(t => t.Codigo).IsUnique();

        builder.HasData(
            new PhotoType
            {
                Id = Guid.Parse("479C59C3-161A-46F8-88B2-638FFC2141E7"),
                Codigo = PhotoTypeCodes.FundoBrancoFrontal,
                Nome = "Fundo Branco Frontal",
                Descricao = "Produto de frente, fundo branco",
                PreservaIdentidadeProduto = true,
            },
            new PhotoType
            {
                Id = Guid.Parse("7EF4CAFB-A4A7-4EC6-8B79-75E3B14F5D8C"),
                Codigo = PhotoTypeCodes.FundoBranco45,
                Nome = "Fundo Branco 45°",
                Descricao = "Produto em ângulo lateral, fundo branco",
                PreservaIdentidadeProduto = true,
            },
            new PhotoType
            {
                Id = Guid.Parse("3DA5829A-FCB3-489A-9C87-4DBEE842E4A0"),
                Codigo = PhotoTypeCodes.FundoBrancoZoom,
                Nome = "Fundo Branco Zoom",
                Descricao = "Zoom no detalhe principal, fundo branco",
                PreservaIdentidadeProduto = true,
            },
            new PhotoType
            {
                Id = Guid.Parse("56407ECD-9472-4900-85ED-F19D3A1CB6B5"),
                Codigo = PhotoTypeCodes.Ambientada,
                Nome = "Ambientada",
                Descricao = "Produto em cenário de uso real",
                PreservaIdentidadeProduto = true,
            },
            new PhotoType
            {
                Id = Guid.Parse("79AE1E53-8A3B-4802-8633-CA4BBA6869DB"),
                Codigo = PhotoTypeCodes.AmbientadaZoom,
                Nome = "Ambientada com Zoom",
                Descricao = "Close do produto no cenário de uso",
                PreservaIdentidadeProduto = true,
            }
        );
    }
}
