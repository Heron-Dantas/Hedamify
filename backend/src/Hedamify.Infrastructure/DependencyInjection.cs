using Hedamify.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Hedamify.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("HedamifyDb")
            ?? throw new InvalidOperationException("Connection string 'HedamifyDb' not configured.");

        services.AddDbContext<HedamifyDbContext>(options => options.UseSqlServer(connectionString));

        return services;
    }
}
