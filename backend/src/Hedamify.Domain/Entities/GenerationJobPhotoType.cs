using Hedamify.Domain.Enums;

namespace Hedamify.Domain.Entities;

public class GenerationJobPhotoType
{
    public Guid Id { get; set; }
    public Guid GenerationJobId { get; set; }
    public Guid PhotoTypeId { get; set; }
    public string? InstrucaoPersonalizada { get; set; }
    public bool AplicarCorrecaoDetalhes { get; set; }
    public GenerationJobPhotoTypeStatus Status { get; set; }
    public string? ResultImageBlobUrl { get; set; }
    public string? ErrorMessage { get; set; }

    public GenerationJob? GenerationJob { get; set; }
    public PhotoType? PhotoType { get; set; }
}
