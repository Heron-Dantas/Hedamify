namespace Hedamify.Domain.Entities;

public class AppUser
{
    public Guid Id { get; set; }
    public required string Email { get; set; }
    public required string Nome { get; set; }
    public required string AzureAdB2CObjectId { get; set; }
    public DateTime CreatedAt { get; set; }

    public ICollection<Product> Products { get; set; } = new List<Product>();
}
