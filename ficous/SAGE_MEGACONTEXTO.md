# Sage e Megacontexto — Visão Geral

Este documento descreve como funciona o sistema de IA "Sage" no Ficous e o mecanismo de "Megacontexto" que personaliza e otimiza as respostas. Também lista o que já está implementado e o que foi deixado para próximas fases.

## Objetivos
- Oferecer respostas adaptativas (níveis 1-3) com base no contexto do usuário
- Reduzir custo/latência usando cache e resumos em camadas (rolling summaries)
- Personalizar via histórico, conceitos fracos/fortes e afinidade por disciplina
- Preparar terreno para RAG avançado e futuras técnicas (embeddings, re-ranking, decay)

## Componentes Principais

- `ficous/backend/app/routers/sage.py`: endpoints de processamento e resposta do Sage
- `ficous/backend/app/services/embeddings.py`: chunks, embeddings, recuperação (RAG)
- `ficous/backend/app/services/summaries.py`: geração/atualização de rolling summaries
- `ficous/backend/app/services/cache.py`: cache de respostas (Redis + memória)
- `ficous/backend/app/routers/admin.py`: endpoints administrativos (rebuild, recompute, dry-run)
- `ficous/backend/app/models.py`: modelos `Summary`, `Interaction`, `Embedding` e estatísticas de usuário

## Fluxo do Sage

1. Entrada (POST `/ficous/sage/answer`)
   - Campos: `note_id` | `discipline_id` | `raw_context`, `prompt`, `level(1..3)`, flags `normalize` e `output_language`
2. Construção do Megacontexto
   - Recupera contexto principal (nota/disciplina/raw)
   - RAG: busca chunks relevantes em `ficous_embeddings` (cosine similarity + PersoScore)
   - Agrega rolling summaries (global e por disciplina)
   - Lista conceitos fracos (top-3)
   - Aplica sanitização e limite de caracteres (`SAGE_MAX_CONTEXT_CHARS`)
3. Cache
   - Busca resposta em cache com hash(prompt + contexto + modelo)
   - Em cache hit: registra interação e retorna
4. IA
   - Chama OpenAI (modelo `gpt-4o-mini`) com formato JSON por nível
   - Valida/normaliza resposta (fallbacks por nível)
5. Registro
   - Registra `ficous_interactions` com metadados e estimativa de tokens
   - Ajusta força de conceitos (incremento leve) quando aplicável

## Níveis de Resposta
- Nível 1: balões curtos (resumo objetivo)
- Nível 2: mini-aula (tópicos com bullets e exemplos)
- Nível 3: imersivo (seções ricas, textos mais longos, código/diagramas quando relevante)

## Rolling Summaries
- `Summary(scope=global|discipline, scope_id?)`
- Critérios de atualização: janela temporal e volume de conteúdo recente
- `POST /ficous/admin/rebuild-summaries` dispara atualizações globais e por disciplina

## RAG (Retrieval Augmented Generation)
- Indexação:
  - Notas são chunkadas (`~400` chars, overlap `~50`) e indexadas com embeddings
  - Embeddings via OpenAI `text-embedding-3-small` (fallback aleatório em dev)
- Recuperação:
  - Similaridade por cosseno e re-ranking com `PersoScore = similarity × strength × recency`
  - Top-K (default 3-5) é incorporado ao megacontexto

## Cache de Respostas
- Chave: `sha256(prompt|context|model)`
- Backend: Redis (`REDIS_URL`) com TTL (`CACHE_TTL_SECONDS`) e fallback em memória
- Endpoints admin: `GET /ficous/admin/cache-stats`, `POST /ficous/admin/clear-cache`

## Endpoints Administrativos
- `POST /ficous/admin/rebuild-summaries` — rebuild de summaries
- `POST /ficous/admin/recompute-stats` — recomputar stats de conceitos/disciplinas a partir de interações
- `POST /ficous/admin/index-content?content_type=notes|sources|all` — indexar conteúdo
- `GET /ficous/admin/dry-run?query=...` — testar RAG sem efeitos colaterais
- `GET /ficous/admin/health` — visão geral de contagens e cache

## Esquema de Dados (principais)
- `ficous_embeddings(user_id, owner_type, owner_id, chunk_text, vector, meta)`
- `ficous_summaries(user_id, scope, scope_id, text, updated_at)`
- `ficous_interactions(user_id, note_id, discipline_id, prompt, response_meta, tokens_estimated)`
- `ficous_user_concept_stats(user_id, concept, strength)`
- `ficous_user_discipline_stats(user_id, discipline_id, affinity)`

## Configurações (env)
- `OPENAI_API_KEY` — chave OpenAI
- `SAGE_MAX_CONTEXT_CHARS` — limite do megacontexto (default 16000)
- `SAGE_DEFAULT_LANG` — idioma padrão (default `pt-BR`)
- `ADMIN_ENABLED` — habilitar endpoints admin (default `true`)
- `REDIS_URL` — URL do Redis (opcional)
- `CACHE_TTL_SECONDS` — TTL do cache de respostas (default 300)

## O que já está implementado (MVP)
- RAG básico com embeddings, chunking e recuperação com PersoScore
- Rolling summaries (global e disciplina), com endpoints de rebuild
- Cache de respostas com Redis + fallback memória
- Integração do RAG no `/ficous/sage/answer`
- Registro de interações e ajuste leve de força de conceitos
- Endpoints admin: rebuild, recompute, indexar, dry-run, health, cache-stats/clear

## O que ficou para depois (Próximas Fases)
- Rate limiting (por IP/usuário) nos endpoints Sage
- Circuit breaker e retries com jitter nas chamadas OpenAI
- PersoScore avançado (com decaimento temporal e peso por acertos/recência/frequência)
- Jobs em background (Celery/RQ/APScheduler) para atualizações incrementais
- Observabilidade (Prometheus/OTEL), métricas detalhadas e logs estruturados
- Sanitização adicional e políticas consistentes de truncamento por token
- Testes automatizados (unitários e integração) para RAG, cache e summaries
- Documentação ampliada com exemplos e troubleshooting

## Como usar rapidamente
1. Configure variáveis de ambiente (`OPENAI_API_KEY`, `REDIS_URL`, etc.)
2. Suba o backend: `uvicorn ficous.backend.app.main:app --reload --port 8002`
3. Crie notas e confirme a indexação automática (POST `/ficous/notes`) 
4. Peça uma resposta ao Sage: `POST /ficous/sage/answer`
5. Opcional: execute admin para rebuild/index/dry-run

## Boas práticas
- Mantenha o conteúdo das notas o mais limpo possível (normalize/`clean_text`)
- Reindexe após grandes alterações de conteúdo (`/ficous/admin/index-content`)
- Ajuste TTL do cache conforme sua carga e latência desejadas
