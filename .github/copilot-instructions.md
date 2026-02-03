Project: CareerMate — AI-backed Django backend + Vite React frontend

Overview
- Django backend (apps: `users`, `jobs`, `ai_agent`, `premium`, `billing`) serving a REST API and server-rendered pages.
- React frontend (Vite) lives in `careermate_backend/frontend-web` and expects the backend at `http://localhost:8000` (CORS allows `localhost:5173`).

Quick dev run (backend)
- Create & activate a venv inside `careermate_backend`.
```bash
cd careermate_backend
py -m venv .venv
.venv\Scripts\activate.ps1    # PowerShell on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Quick dev run (frontend)
```bash
cd careermate_backend/frontend-web
npm install
npm run dev    # Vite dev server (port 5173)
```

Key integration points
- AI: `careermate_backend/ai_agent/utils.py` uses `google.generativeai` (Gemini). Set `GOOGLE_API_KEY` in a `.env` file loaded by `dotenv` before running.
- PDF processing: `ai_agent/utils.py` uses `pdfminer.extract_text` and wraps Django `UploadedFile` with `io.BytesIO` — keep that pattern when handling files.
- Persistence: `ai_agent/models.py` stores the AI output in a JSONField named `analysis_result`. Views expect this exact field name.
- Auth: custom user model `users.User` (see `users/models.py`). `AUTH_USER_MODEL = 'users.User'` in `careermate_backend/careermate_backend/settings.py`.

Project-specific conventions & gotchas
- Do NOT import the `User` model directly across apps. Reference the user with `settings.AUTH_USER_MODEL` or the string `'users.User'` (see `users/models.py` comments).
- The `users.User` model sets `Meta.db_table = 'auth_user'` — migrations and raw SQL may rely on that table name.
- AI prompts must return a strict JSON payload for `analyze_cv()` to `json.loads()` safely; the code strips `````json``` markers but still expects well-formed JSON.
- Views that accept file uploads use `parser_classes = (MultiPartParser, FormParser)`. When testing, send `multipart/form-data` with key `file`.
- Backend default DB is SQLite (settings show `db.sqlite3`), but `psycopg2-binary` is present in `requirements.txt` indicating Postgres can be used.

Where to look first
- `careermate_backend/careermate_backend/settings.py` — CORS, auth model, JWT and media settings.
- `careermate_backend/users/models.py` — custom `User` model and related notes.
- `careermate_backend/ai_agent/utils.py` — AI + PDF handling, required env var `GOOGLE_API_KEY`.
- `careermate_backend/ai_agent/views.py` and `careermate_backend/ai_agent/urls.py` — API endpoints: `/ai/analyze/`, `/ai/chat/`, `/ai/latest/`.
- `careermate_backend/frontend-web/package.json` — frontend start/build commands; dev server runs on 5173 and is allowed in CORS.

Common commands & troubleshooting
- Apply migrations: `python manage.py migrate`
- Create superuser: `python manage.py createsuperuser`
- If AI calls fail: verify `.env` contains `GOOGLE_API_KEY`; `ai_agent/utils.py` will raise on missing key.
- If PDF extraction returns empty: check that file bytes are passed through and `pdfminer.six` is installed.

Editing notes for AI agents
- When changing prompts in `ai_agent/utils.py`, preserve the requirement that the model returns pure JSON for `analyze_cv()`.
- Respect exact field names used by views/models (`extracted_text`, `analysis_result`).
- Keep generation config values (`temperature`, `max_output_tokens`) visible near prompts so reviewers can tune them.

If anything above is unclear or you want this adapted for the Flask example in the workspace, tell me which areas to expand.
