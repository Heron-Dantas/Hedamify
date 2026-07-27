# Hedamify — Especificação Técnica (Fase 1)

> Documento-base para desenvolvimento guiado via Claude Code no VS Code.
> Reflete o alinhamento de arquitetura, funcionalidades e stack combinado antes do início da implementação.

## 1. Objetivo do produto

SaaS que recebe fotos "cruas" de produtos (tiradas em casa, celular, iluminação/fundo não profissionais) e gera, via IA, fotos prontas para anúncio em marketplaces (Shopee, Mercado Livre, Amazon):

- Versões fiéis do produto em fundo branco (frontal, 45°, zoom), preservando exatamente as características reais do objeto.
- Versões "ambientadas" (lifestyle), colocando o produto em um cenário que faça sentido para seu uso, com liberdade criativa no ambiente mas preservando a identidade do produto.

Exemplo de referência: um suporte de controle de PS5 com tema GTA 6 gera, além do fundo branco, uma foto ambientada ao lado de uma TV com um PS5 ligado.

Esta fase 1 cobre **apenas a função principal de geração de imagem**. Créditos/billing, dashboard e histórico de uso ficam para fases futuras (ver seção 9).

## 2. Fluxo funcional (UI)

Baseado no app de referência (ver imagens `Passo1.jpeg`, `Passo2.jpeg`, `Passo3.jpeg`, `ExplicaçãoSimplesObjetivo.jpeg` nesta mesma pasta).

**Step 1 — Nome do produto**
Usuário informa o nome do produto (ex: "Suporte controle video game GTA 6"). Ajuda a IA a entender o que está fotografando.
> Modo "Kit" (múltiplos produtos numa mesma geração) existe no app de referência mas **está fora do escopo da fase 1** — só "Produto Único".

**Step 2 — Upload das fotos**
- Mínimo de 3 fotos: frente, outro ângulo, foto de contexto/ambiente.
- Formatos aceitos: JPG, PNG, WEBP, HEIC. Máximo 10MB por imagem.
- Podem ser fotos de celular, sem qualidade profissional.

**Step 3 — Seleção dos tipos de foto a gerar**
Catálogo fixo de tipos (cards selecionáveis, multi-seleção, mínimo 1):

| Tipo | Descrição | Preserva identidade do produto |
|---|---|---|
| Fundo Branco Frontal | Produto de frente, fundo branco | Sim (fiel) |
| Fundo Branco 45° | Produto em ângulo lateral, fundo branco | Sim (fiel) |
| Fundo Branco Zoom | Zoom no detalhe principal, fundo branco | Sim (fiel) |
| Ambientada | Produto em cenário de uso real | Sim, mas com liberdade criativa no ambiente |
| Ambientada com Zoom | Close do produto no cenário de uso | Sim, mas com liberdade criativa no ambiente |

**Step 4 — Personalização (opcional) + correção de detalhes**
Para cada tipo selecionado no Step 3, o usuário pode:
- Escrever uma instrução textual (ex: "ao lado de uma TV com PS5 ligado, tema GTA 6").
- **Ou gravar um áudio** com a mesma instrução — transcrito via Whisper (OpenAI) e salvo como texto.
- Marcar um checkbox **"Aplicar correção de detalhes"** por tipo de foto (ou usar um atalho "aplicar a todos"). Esse checkbox autoriza a IA a corrigir pequenas imperfeições de fabricação (ex: falhas comuns de peças em impressão 3D) **sem alterar o conteúdo/design do produto**. É uma decisão independente da escolha do tipo de foto.

Botão final: **"Gerar Carrossel"**.

**Pós-geração**
- Processamento assíncrono (~1 min por geração completa). O usuário pode fechar o navegador e navegar em outros sites; ao voltar, vê o status (em processamento/concluído) e o resultado.
- Download individual de cada imagem gerada ou em lote (ZIP).
- **Fora da fase 1**: editor visual para ajustar cada slide antes do download (crop, texto, reposicionamento). Fica para fase futura.

## 3. Stack técnica

| Camada | Tecnologia |
|---|---|
| Frontend | Angular + Tailwind CSS |
| Backend | ASP.NET Core Web API (C#) |
| Banco de dados | Azure SQL Database |
| Storage de arquivos | Azure Blob Storage (fotos originais + imagens geradas) |
| Autenticação | Azure AD B2C |
| Fila / processamento assíncrono | Azure Storage Queue + worker (Azure Function ou serviço em background) |
| Geração de imagem por IA | OpenAI (Images API), abstraído atrás de interface própria |
| Transcrição de áudio | OpenAI Whisper |
| Hospedagem | Azure (App Service / Azure Functions) |

**Por que essas escolhas:**
- Stack 100% Microsoft/Azure por preferência explícita do usuário, evitando misturar provedores (ex: Vercel/Supabase não hospedam .NET nativamente).
- Azure SQL Database escolhido em vez de Postgres Flexible Server por integração mais nativa com EF Core e tooling .NET.
- Geração de imagem e transcrição de áudio ambas na OpenAI para reaproveitar a mesma integração/API key nesta fase inicial — arquitetura permite trocar de provedor depois sem refatoração ampla (ver seção 6).
- Autenticação (Azure AD B2C) implementada desde a fase 1, mesmo sem sistema de créditos ainda, para já vincular histórico de gerações a um usuário e evitar migração de dados depois.

## 4. Arquitetura (visão geral)

```
Angular SPA (Tailwind)
        │  HTTPS / REST
        ▼
ASP.NET Core Web API  ──────────► Azure AD B2C (autenticação)
        │
        ├── grava metadados ──────► Azure SQL Database
        ├── upload de fotos ──────► Azure Blob Storage
        └── enfileira job  ──────► Azure Storage Queue
                                        │
                                        ▼
                              Worker (Azure Function)
                                        │
                        ┌───────────────┼────────────────┐
                        ▼               ▼                ▼
                  OpenAI Images   OpenAI Whisper    Azure Blob Storage
                  (geração)       (transcrição      (salva imagem
                                   de áudio)          resultado)
                                        │
                                        ▼
                          Atualiza status no Azure SQL
```

O frontend consulta o status da geração via polling em um endpoint de status (`GET /api/jobs/{id}`), permitindo que o usuário saia e volte depois sem perder o progresso.

## 5. Modelo de dados (fase 1)

```
AppUser
  Id (PK)
  Email
  Nome
  AzureAdB2CObjectId
  CreatedAt

Product
  Id (PK)
  UserId (FK -> AppUser)
  Nome
  CreatedAt

ProductPhoto
  Id (PK)
  ProductId (FK -> Product)
  BlobUrl
  Ordem
  CreatedAt

PhotoType                       -- catálogo fixo, seed de dados
  Id (PK)
  Codigo                        -- FundoBrancoFrontal, FundoBranco45, FundoBrancoZoom, Ambientada, AmbientadaZoom
  Nome
  Descricao
  PreservaIdentidadeProduto     -- bool

GenerationJob
  Id (PK)
  ProductId (FK -> Product)
  Status                        -- Queued | Processing | Completed | Failed | PartiallyFailed
  CreatedAt
  CompletedAt

GenerationJobPhotoType
  Id (PK)
  GenerationJobId (FK -> GenerationJob)
  PhotoTypeId (FK -> PhotoType)
  InstrucaoPersonalizada         -- texto direto ou transcrito do áudio
  AplicarCorrecaoDetalhes        -- bool
  Status                         -- Queued | Processing | Completed | Failed
  ResultImageBlobUrl
  ErrorMessage
```

`GenerationJobPhotoType` é a tabela central: cada linha representa "este tipo de foto, com esta instrução, com ou sem correção de detalhes, neste job". O botão "aplicar a todos" no Step 4 é só uma conveniência de UI que marca `AplicarCorrecaoDetalhes = true` em todas as linhas do job de uma vez.

Estrutura pensada para extensão futura (Kit, créditos) sem migração destrutiva — mas nenhuma tabela/campo de fases futuras é criado agora.

## 6. Abstração do provedor de IA

```csharp
public interface IImageGenerationProvider
{
    Task<GeneratedImageResult> GenerateAsync(ImageGenerationRequest request, CancellationToken ct);
}

public interface ITranscriptionProvider
{
    Task<string> TranscribeAsync(Stream audio, CancellationToken ct);
}
```

`ImageGenerationRequest` carrega: fotos originais do produto, o `PhotoType` (incluindo a flag `PreservaIdentidadeProduto`), a instrução personalizada e a flag `AplicarCorrecaoDetalhes`.

A implementação `OpenAiImageGenerationProvider` monta o prompt de forma diferente conforme o tipo:

- **Tipos fiéis** (fundo branco frontal/45°/zoom): instrui o modelo a preservar exatamente as características do produto original, alterando apenas fundo/enquadramento. Se `AplicarCorrecaoDetalhes = true`, adiciona instrução para corrigir pequenas imperfeições de fabricação (ex: defeitos comuns de impressão 3D) sem alterar o design.
- **Tipos ambientados**: mais liberdade criativa para compor um cenário de uso real, guiado pela instrução personalizada do usuário, mantendo a identidade do produto.

Trocar de provedor de IA no futuro = implementar uma nova classe para essas interfaces, sem alterar o restante do sistema (worker, banco, frontend).

Nesta fase 1: **1 imagem gerada por tipo selecionado** (sem variações múltiplas para o usuário escolher).

## 7. Processamento assíncrono

1. Usuário clica "Gerar Carrossel" → API cria `GenerationJob` (status `Queued`) e uma linha de `GenerationJobPhotoType` para cada tipo selecionado → enfileira mensagem na Azure Storage Queue.
2. Worker consome a mensagem, processa cada `GenerationJobPhotoType`:
   - Se houver áudio, transcreve via Whisper e salva em `InstrucaoPersonalizada`.
   - Chama `IImageGenerationProvider.GenerateAsync`.
   - Salva resultado no Blob Storage, atualiza status da linha.
3. Quando todas as linhas do job terminam, atualiza `GenerationJob.Status` para `Completed` (ou `PartiallyFailed` se alguma falhou).
4. Frontend consulta o status via polling (`GET /api/jobs/{id}`) — funciona mesmo se o usuário fechou o navegador e voltou depois.

## 8. Validações e regras de negócio

- Mínimo 3 fotos no upload (Step 2).
- Mínimo 1 tipo de foto selecionado (Step 3).
- Formatos aceitos: JPG, PNG, WEBP, HEIC — máx. 10MB por imagem.
- Correção de detalhes nunca altera o conteúdo/design do produto — só corrige pequenas imperfeições físicas (ex: impressão 3D), é sempre opt-in por tipo de foto.
- Tipos "fiéis" (fundo branco) devem preservar rigorosamente as características reais do produto; tipos "ambientados" têm liberdade criativa apenas sobre o cenário, não sobre o produto em si.

## 9. Fora do escopo da fase 1 (planejado para depois)

- Modo "Kit" (múltiplos produtos numa mesma geração).
- Editor visual pós-geração (crop, texto, reposicionamento de cada slide).
- Sistema de créditos e compra de créditos.
- Dashboard e histórico de uso.
- Múltiplas variações de imagem por tipo (hoje: 1 imagem por tipo).
- Suporte a múltiplos provedores de IA simultâneos (hoje: só OpenAI, mas já abstraído).

## 10. Decisões já tomadas (registro do alinhamento)

- Stack: Angular + Tailwind (frontend), ASP.NET Core (backend), Azure completo (hosting, banco, storage, auth).
- Autenticação via Azure AD B2C desde a fase 1.
- Geração de imagem: OpenAI, arquitetura permite trocar depois.
- Transcrição de áudio: Whisper (OpenAI).
- Escopo fase 1: só "Produto Único" (sem Kit).
- Sem editor visual na fase 1 — só geração + download (individual/ZIP).
- 1 imagem gerada por tipo de foto selecionado (sem variações).
- Checkbox de correção de detalhes é por tipo de foto (com atalho "aplicar a todos"), não altera conteúdo do produto.
