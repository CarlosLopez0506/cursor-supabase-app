<h1 align="center">🎓 EduInsights — Student Performance Analytics</h1>

<p align="center">
  <strong>Full-stack data analytics platform with ML predictions, built with React, Supabase & FastAPI</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/scikit--learn-RandomForest-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white" />
  <img src="https://img.shields.io/badge/Recharts-Visualizations-FF6B6B?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Deployed-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" />
  <img src="https://img.shields.io/badge/Status-Live-brightgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/ML%20API-Online-brightgreen?style=flat-square" />
</p>

---

## ✨ What it does

**EduInsights** is an end-to-end analytics platform that lets you explore, visualize, and predict student academic performance across 1,000 students.

| Feature | Description |
|---|---|
| 📊 **Interactive Dashboard** | KPI cards + 4 chart types (bar, line, scatter, pie) powered by Recharts |
| 🔍 **Data Explorer** | Filterable, sortable, searchable table with CSV export |
| 🤖 **ML Predictor** | Random Forest model predicts math pass/fail with confidence score |
| ☁️ **Cloud-native** | Supabase (PostgreSQL) + Render (ML API) + Vite frontend |

---

# cursor-supabase-app

![React](https://img.shields.io/badge/React-Vite-61DAFB?style=flat&logo=react&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat&logo=supabase&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-ML%20API-009688?style=flat&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat&logo=python&logoColor=white)
![Cursor](https://img.shields.io/badge/Cursor-AI--first-000000?style=flat)

Full-stack template for building data visualization applications with React, Supabase, and a FastAPI ML backend. Designed to be used with Cursor AI — the project rules and MCP config are already wired so Cursor understands the stack and can extend it from a prompt.

## What This Is

This template provides a full-stack foundation: a React frontend with Recharts visualizations, Supabase for the database, and a FastAPI ML API. Everything is wired up with environment variables, reusable components, and clear comments so you can adapt it to your dataset without hunting through the codebase.

## Prerequisites

- **Node.js 18+**
- **Python 3.10+**
- **Supabase account** — [supabase.com](https://supabase.com)
- **Render account** — [render.com](https://render.com) (for ML API)
- **Vercel account** — [vercel.com](https://vercel.com) (for frontend)
- **Cursor IDE** — [cursor.com](https://cursor.com)

## Setup in 5 Steps

### 1. Clone the repo

```bash
git clone https://github.com/your-org/cursor-supabase-app.git
cd cursor-supabase-app
```

### 2. Configure Supabase

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. Open **SQL Editor** and run `supabase/migrations/001_initial_schema.sql`.
3. Optionally run `supabase/seed.sql` for sample data, or use **Table Editor > Import from CSV** to upload your own data.

### 3. Configure environment variables

Copy `frontend/.env.example` to `frontend/.env.local` and fill in:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_KEY=your-anon-public-key
VITE_ML_API_URL=http://localhost:8000
VITE_APP_TITLE=My Data App
```

Find URL and key in **Supabase Dashboard > Project Settings > API**.

### 4. Configure Cursor MCP

Replace `YOUR_SUPABASE_PERSONAL_ACCESS_TOKEN_HERE` in `.cursor/mcp.json` with your token from [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens). This lets Cursor AI interact with your Supabase project.

### 5. Run locally

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**ML API:**
```bash
cd ml-api
python -m venv venv
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Open [http://localhost:5173](http://localhost:5173) for the app.

## How to Use Cursor to Build on This Template

With the project rules in `.cursor/rules/`, Cursor understands the stack. Example prompts:

1. **"Add a new bar chart to the dashboard showing revenue by region"** — Cursor will use the BarChartWidget and wire it to Supabase via useSupabase.
2. **"Filter the Data Explorer by date range"** — Cursor will extend FilterBar and DataExplorer.
3. **"Change the Predictor form to accept 5 features instead of 3"** — Cursor will update PREDICTOR_FIELDS and the schema.
4. **"Add a line chart for monthly trends"** — Cursor will use LineChartWidget and aggregateByKey.
5. **"Create a new page for inventory"** — Cursor will add a route, page, and useSupabase for your table.

## How to Deploy

### Frontend (Vercel)

1. Push the repo to GitHub.
2. In Vercel, create a new project and import the repo.
3. Set **Root Directory** to `frontend` or use the default (vercel.json handles build).
4. Add environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_KEY`, `VITE_ML_API_URL`, `VITE_APP_TITLE`.
5. Deploy.

### ML API (Render)

1. In Render, create a **Web Service**.
2. Connect the same GitHub repo.
3. Set **Root Directory** to `ml-api`.
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add `VITE_ML_API_URL` to the frontend env with the Render URL (e.g. `https://cursor-supabase-ml-api.onrender.com`).

## Project Structure

| Folder | Purpose |
|--------|---------|
| `.cursor/` | MCP config and project rules for Cursor AI |
| `frontend/` | React + Vite app, Recharts, Supabase client |
| `ml-api/` | FastAPI ML service, scikit-learn, predictor |
| `supabase/` | Migrations and seed SQL |
| `data/` | Place CSV files here for training and import |

## How to Adapt for Your Own Dataset

1. **`supabase/migrations/001_initial_schema.sql`** — Define your table.
2. **`frontend/src/pages/Dashboard.jsx`** — Replace `APP_CONFIG.tableName` and chart keys.
3. **`frontend/src/pages/DataExplorer.jsx`** — Update `TABLE_NAME`, `COLUMNS`, `FILTER_CONFIG`.
4. **`ml-api/scripts/train.py`** — Set `CSV_FILE`, `TARGET_COLUMN`, `FEATURE_COLUMNS`.
5. **`frontend/src/pages/Predictor.jsx`** — Set `PREDICTOR_FIELDS` and `MODEL_DESCRIPTION`.

## Stitch Design Assets (Dashboard Principal)

If you use Google Stitch to generate the **Dashboard Principal** screen described in `PRD.md`, store the exported assets under:

- `design/stitch/dashboard-principal/` — screenshot and HTML/CSS reference from Stitch.

Example download commands (replace the URLs with the ones Stitch gives you):

```bash
curl -L "https://stitch.example.com/path/to/screenshot.png" -o design/stitch/dashboard-principal/dashboard-principal.png

curl -L "https://stitch.example.com/path/to/dashboard.html" -o design/stitch/dashboard-principal/dashboard-principal.html
```

The live dashboard implementation lives in `frontend/src/pages/Dashboard.jsx` and `frontend/src/pages/Dashboard.module.css`, which follow the PRD structure and use mock student data by default. Later you can swap the mock data for real Supabase queries using the `students` table.
