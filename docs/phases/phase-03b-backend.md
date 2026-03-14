# Phase 3b — Backend

> **Status: Not started — prerequisite for Phase 4 (speaking) and LLM answer validation.**
> Full application backend: user accounts, persistent progress, cloud sync, and AI inference. Python + FastAPI + PostgreSQL + Docker. The app transitions from local-only (IndexedDB) to a real client-server architecture while keeping offline-capable behavior.

**Goal:** Build the backend that makes ItaLearn a real application: user accounts, server-side progress storage, synced SRS state, and AI inference endpoints (Whisper + LLM). Everything runs in Docker Compose for one-command setup.

## What This Delivers

- User authentication via Clerk (no custom auth code)
- Server-side storage of all user progress, SRS cards, and lesson state
- Sync: frontend writes to server, server is source of truth
- Local Whisper transcription endpoint (Italian speech → text)
- LLM answer validation endpoint (hardcoded miss → "is this acceptable?")
- Verdict caching so the LLM is called less over time
- Docker Compose one-command setup (API + PostgreSQL + GPU inference)

## Tech Stack

| Component | Choice | Why |
|-----------|--------|-----|
| Language | Python 3.12+ | AI/ML ecosystem, faster-whisper, llama-cpp-python all native |
| Framework | FastAPI | Async, fast, auto-generates OpenAPI docs, dependency injection |
| Database | PostgreSQL 16 | Robust, great JSON support for flexible data, scales to any size needed |
| ORM | SQLAlchemy 2.0 + Alembic | Async support, type-safe queries, migration management |
| Auth | Clerk | Managed auth — no custom JWT, password, or session code. React SDK + backend JWT verification |
| Whisper | faster-whisper (CTranslate2) | 4x faster than openai/whisper, lower VRAM, same accuracy |
| LLM | llama-cpp-python (Phi-3 / Gemma 2B GGUF) | Tiny model, runs on CPU for yes/no judgments, no GPU contention with Whisper |
| Container | Docker + Docker Compose | GPU passthrough for Whisper, PostgreSQL included, reproducible setup |

## Database Schema

### Users

Synced from Clerk — user row created on first authenticated request.

```sql
CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_id      VARCHAR(255) UNIQUE NOT NULL,
    email         VARCHAR(255) NOT NULL,
    display_name  VARCHAR(100),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### User Progress

Mirrors the current IndexedDB `progress` store but per-user and server-side.

```sql
CREATE TABLE user_progress (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lessons_completed   JSONB NOT NULL DEFAULT '[]',    -- list of lesson IDs
    current_section     VARCHAR(50),
    current_unit        VARCHAR(50),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);
```

### SRS Cards

Mirrors the current IndexedDB `srsCards` table but per-user.

```sql
CREATE TABLE srs_cards (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    word_id         VARCHAR(100) NOT NULL,
    skill_type      VARCHAR(50) NOT NULL,
    due             TIMESTAMPTZ NOT NULL,
    stability       FLOAT NOT NULL,
    difficulty      FLOAT NOT NULL,
    elapsed_days    INTEGER NOT NULL DEFAULT 0,
    scheduled_days  INTEGER NOT NULL DEFAULT 0,
    reps            INTEGER NOT NULL DEFAULT 0,
    lapses          INTEGER NOT NULL DEFAULT 0,
    state           INTEGER NOT NULL DEFAULT 0,        -- FSRS card state
    last_review     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, word_id, skill_type)
);

CREATE INDEX idx_srs_cards_due ON srs_cards(user_id, due);
```

### LLM Verdict Cache

Shared across all users — if "buongiorno" is accepted for "hello" once, it's accepted for everyone.

```sql
CREATE TABLE verdict_cache (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exercise_key    VARCHAR(500) NOT NULL,   -- normalized hash of exercise type + prompt + expected
    user_answer     VARCHAR(500) NOT NULL,
    accepted        BOOLEAN NOT NULL,
    reason          TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(exercise_key, user_answer)
);
```

## API Design

Base URL: `http://localhost:8000/api/v1`

### Auth (Clerk-managed)

Auth is handled by Clerk's React SDK on the frontend. The backend only verifies Clerk JWTs.

```
GET /auth/me
  Headers:  Authorization: Bearer <clerk_session_token>
  Response: { "id": "...", "clerk_id": "...", "email": "...", "display_name": "..." }
  Note:     Auto-creates user row on first request (upsert from Clerk JWT claims)
```

### Progress

All endpoints require `Authorization: Bearer <token>`.

```
GET  /progress              — get user's full progress state
PUT  /progress              — update progress (lesson completed, unit unlocked, etc.)

GET  /srs/cards             — get all user's SRS cards
GET  /srs/due               — get cards due for review
POST /srs/cards             — create new SRS card(s) (with dedup)
PUT  /srs/cards/:id/review  — update card after review (FSRS state)
```

### AI Inference

```
POST /ai/transcribe
  Auth:     Bearer <clerk_session_token>
  Request:  multipart/form-data
    - audio: binary (webm/opus from MediaRecorder)
    - expected_text?: string  (Whisper initial_prompt bias)
  Response: { "text": "ciao come stai", "confidence": 0.92 }

POST /ai/validate
  Auth:     Bearer <clerk_session_token>
  Request:  {
    "exercise_type": "translation",
    "prompt": "How do you say 'hello' in Italian?",
    "expected_answers": ["Ciao", "Salve"],
    "user_answer": "Buongiorno",
    "context": "Greeting, lesson on basic introductions"
  }
  Response: { "accepted": true, "reason": "Buongiorno is a valid greeting" }
```

The `expected_text` parameter for `/transcribe` is key — passing the expected answer as Whisper's `initial_prompt` biases recognition toward the Italian vocabulary the learner is attempting, dramatically improving accuracy for non-native speakers.

For `/validate`, the backend checks the verdict cache first. On cache miss, it queries the LLM and caches the result. Cached verdicts are shared across all users.

### Health

```
GET /health
  Response: {
    "status": "ok",
    "db": "connected",
    "whisper_model": "large-v3",
    "llm_model": "phi-3-mini-4k-instruct-q4_k_m",
    "gpu_available": true
  }
```

## Docker Compose Setup

```yaml
# docker-compose.yml
services:
  db:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: italearn
      POSTGRES_USER: italearn
      POSTGRES_PASSWORD: ${DB_PASSWORD:-localdev}

  api:
    build: ./backend
    ports:
      - "8000:8000"
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - ./backend/models:/app/models      # Downloaded model weights
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    environment:
      - DATABASE_URL=postgresql+asyncpg://italearn:${DB_PASSWORD:-localdev}@db:5432/italearn
      - CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
      - WHISPER_MODEL=large-v3
      - LLM_MODEL=phi-3-mini-4k-instruct-q4_k_m.gguf
      - DEVICE=cuda
      - CORS_ORIGINS=http://localhost:5173,http://localhost:4173

volumes:
  pgdata:
```

### Model Management

- Models are downloaded once to a mounted volume (`backend/models/`)
- A `Makefile` target handles first-time download
- Whisper `large-v3`: ~3GB VRAM, best Italian accuracy
- Phi-3 Mini Q4: ~2.5GB RAM (runs on CPU), more than enough for yes/no validation
- Both fit comfortably on an RTX 3070 Ti (8GB VRAM) — Whisper on GPU, LLM on CPU

## Project Structure

```
backend/
  Dockerfile
  requirements.txt
  alembic.ini
  Makefile                   # setup, migrate, download-models, run
  app/
    main.py                  # FastAPI app, CORS, lifespan (model loading, DB pool)
    config.py                # Settings from env vars (pydantic-settings)
    database.py              # Async SQLAlchemy engine + session factory

    routers/
      auth.py                # GET /auth/me (Clerk JWT verified)
      progress.py            # GET/PUT progress, SRS card CRUD
      transcribe.py          # POST /ai/transcribe
      validate.py            # POST /ai/validate
      health.py              # GET /health

    models/                  # SQLAlchemy ORM models
      user.py
      progress.py
      srs_card.py
      verdict_cache.py

    schemas/                 # Pydantic request/response models
      auth.py
      progress.py
      srs.py
      transcribe.py
      validate.py

    services/
      auth.py                # Clerk JWT verification, user upsert
      progress.py            # Progress CRUD operations
      srs.py                 # SRS card operations (create, review, due query)
      whisper.py             # faster-whisper model wrapper
      llm.py                 # llama-cpp-python wrapper, prompt template
      verdict_cache.py       # Cache lookup/store

    dependencies.py          # FastAPI deps: get_db, get_current_user (Clerk)

  migrations/                # Alembic migrations
    versions/
    env.py
```

## Frontend Changes

The frontend transitions from IndexedDB-only to server-backed with auth.

### Auth Flow (Clerk)
- `@clerk/clerk-react` provides `<ClerkProvider>`, `<SignIn>`, `<SignUp>`, `<UserButton>`
- Clerk handles all session management, token refresh, and UI
- `useAuth()` hook provides session token for API calls
- Protected routes: redirect to Clerk sign-in if no session

### Data Layer Migration
- Current: Zustand stores → Dexie (IndexedDB)
- New: Zustand stores → API calls → PostgreSQL
- The Zustand stores keep the same interface — only the persistence layer changes
- Stores call API endpoints instead of Dexie for reads/writes
- `HydrationGuard` fetches initial state from API instead of IndexedDB on app load

### API Client (`src/engine/api.ts`)
```typescript
const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1';

// Progress
export async function getProgress(): Promise<UserProgress>;
export async function updateProgress(progress: Partial<UserProgress>): Promise<UserProgress>;

// SRS
export async function getDueCards(): Promise<SRSCard[]>;
export async function createCards(cards: NewCard[]): Promise<SRSCard[]>;
export async function reviewCard(cardId: string, grade: number): Promise<SRSCard>;

// AI
export async function transcribe(audio: Blob, expectedText?: string): Promise<TranscribeResult>;
export async function validate(exercise: ValidateRequest): Promise<ValidateResult>;
```

### No Offline Mode
- The app requires the backend to be running — no offline fallback
- IndexedDB (Dexie) is fully removed once the migration is complete
- All reads/writes go through the API

## Implementation Order

1. **Docker Compose + PostgreSQL + FastAPI skeleton** — health endpoint, DB connection, CORS, Alembic setup (#48)
2. **Clerk auth** — Clerk JWT verification, user upsert, `get_current_user` dependency (#49)
3. **Progress + SRS endpoints** — CRUD operations mirroring current Dexie store interface (#50)
4. **Frontend auth** — ClerkProvider, sign-in/up pages, protected routes (#51)
5. **Frontend data migration** — swap Dexie calls for API calls, remove Dexie entirely (#52)
6. **Whisper endpoint** — `/ai/transcribe` with `expected_text` prompt biasing (#53)
7. **LLM validation endpoint** — `/ai/validate` with Phi-3, verdict cache in PostgreSQL (#54)

Steps 1-3 are backend-only. Steps 4-5 are the big frontend migration. Steps 6-7 can happen in parallel with or after Phase 4 speaking exercises.
