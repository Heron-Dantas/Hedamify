namespace Hedamify.Domain.Entities;

public class Product
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public required string Nome { get; set; }
    public DateTime CreatedAt { get; set; }

    public AppUser? User { get; set; }
    public ICollection<ProductPhoto> Photos { get; set; } = new List<ProductPhoto>();
    public ICollection<GenerationJob> GenerationJobs { get; set; } = new List<GenerationJob>();
}
