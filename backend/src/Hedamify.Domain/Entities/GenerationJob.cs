using Hedamify.Domain.Enums;

namespace Hedamify.Domain.Entities;

public class GenerationJob
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public GenerationJobStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }

    public Product? Product { get; set; }
    public ICollection<GenerationJobPhotoType> Itens { get; set; } = new List<GenerationJobPhotoType>();
}
