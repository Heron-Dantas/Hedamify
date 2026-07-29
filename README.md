# Hedamify

SaaS que transforma fotos "cruas" de produtos em imagens prontas para anúncio em marketplaces, usando IA generativa.

Especificação completa: [Documentacao/ESPECIFICACAO-TECNICA.md](Documentacao/ESPECIFICACAO-TECNICA.md)

## Estrutura do repositório

```
backend/     ASP.NET Core Web API + worker de processamento assíncrono
  src/
    Hedamify.Api/             Web API (controllers, endpoints)
    Hedamify.Domain/          Entidades e regras de negócio
    Hedamify.Infrastructure/  EF Core, Azure Blob Storage, providers de IA (OpenAI)
    Hedamify.Worker/          Processamento assíncrono da fila (geração de imagens)

frontend/    Angular + Tailwind CSS (SPA)

infra/       Infraestrutura como código (Azure)

Documentacao/  Especificação técnica e materiais de referência
```

## Backend

Banco de dados local (SQL Server via Docker, mesmo provider do Azure SQL usado em produção):

```
cd backend
docker compose up -d
export PATH="$PATH:$HOME/.dotnet/tools"   # se a ferramenta dotnet-ef não estiver no PATH
dotnet tool install -g dotnet-ef --version 10.0.10   # primeira vez apenas
dotnet ef database update --project src/Hedamify.Infrastructure --startup-project src/Hedamify.Api
dotnet build Hedamify.slnx
```

A connection string de dev está em `src/Hedamify.Api/appsettings.Development.json` (usuário `sa`, senha `Hedamify_Dev123!` — só para uso local). Em produção, a connection string do Azure SQL deve vir da configuração do App Service, nunca de um arquivo versionado.

Para criar uma nova migration depois de alterar entidades:

```
dotnet ef migrations add NomeDaMigration --project src/Hedamify.Infrastructure --startup-project src/Hedamify.Api --output-dir Data/Migrations
```

## Frontend

```
cd frontend
npm install
npm start
```
