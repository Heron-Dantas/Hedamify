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

```
cd backend
dotnet build Hedamify.slnx
```

## Frontend

```
cd frontend
npm install
npm start
```
