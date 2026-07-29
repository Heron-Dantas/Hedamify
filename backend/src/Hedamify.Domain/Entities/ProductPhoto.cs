namespace Hedamify.Domain.Entities;

public class ProductPhoto
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public required string BlobUrl { get; set; }
    public int Ordem { get; set; }
    public DateTime CreatedAt { get; set; }

    public Product? Product { get; set; }
}
