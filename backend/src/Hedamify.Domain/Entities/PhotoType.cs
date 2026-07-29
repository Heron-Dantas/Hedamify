namespace Hedamify.Domain.Entities;

public class PhotoType
{
    public Guid Id { get; set; }
    public required string Codigo { get; set; }
    public required string Nome { get; set; }
    public required string Descricao { get; set; }
    public bool PreservaIdentidadeProduto { get; set; }

    public ICollection<GenerationJobPhotoType> GenerationJobPhotoTypes { get; set; } = new List<GenerationJobPhotoType>();
}
