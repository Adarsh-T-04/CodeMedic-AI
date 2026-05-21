<p align="center">
  <img src="frontend/public/favicon.svg" width="80" alt="CodeMedic AI Logo" />
</p>

<h1 align="center">CodeMedic AI</h1>

<p align="center">
  <strong>AI-powered code debugging & analysis platform</strong><br/>
  Detect bugs, get instant explanations, auto-fix your code, and compare execution results — all in one click.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Groq-FF6B35?style=for-the-badge&logo=groq&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🐛 **AI Bug Detection** | Powered by Groq's `llama-3.3-70b-versatile` — finds bugs with line numbers and severity levels |
| 🔧 **Auto-Fix** | Generates corrected, runnable code for every bug found |
| 📊 **Quality Score** | 0–100 code quality rating with animated SVG ring visualization |
| ▶️ **Live Execution** | Sandboxed Python execution — runs both original and fixed code |
| 🔄 **Before & After** | Side-by-side comparison of original vs fixed output |
| 💡 **Explanations** | Clear, human-readable explanations of what went wrong |
| ⚡ **Fast Inference** | Groq API delivers sub-second AI responses |
| 🎨 **Modern UI** | Dark theme, glassmorphism, micro-animations, Inter + JetBrains Mono typography |

---

## 🏗️ Tech Stack

### Backend
- **Framework:** FastAPI (Python 3.11+)
- **AI Provider:** Groq (OpenAI-compatible API)
- **Model:** `llama-3.3-70b-versatile`
- **Code Execution:** Sandboxed subprocess with timeout protection
- **Validation:** Pydantic v2

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS v4
- **HTTP Client:** Axios
- **Typography:** Inter + JetBrains Mono (Google Fonts)

---

## 📁 Project Structure

```
CodeMedic-AI/
├── backend/
│   ├── main.py                  # FastAPI app entry point
│   ├── requirements.txt         # Python dependencies
│   ├── Procfile                 # Render deployment command
│   ├── render.yaml              # Render blueprint config
│   ├── .env.example             # Environment variables template
│   ├── routes/
│   │   └── analyze.py           # /analyze endpoint (orchestrates pipeline)
│   ├── schemas/
│   │   └── request_response.py  # Pydantic models for API contracts
│   └── services/
│       ├── ai_service.py        # Groq AI integration & response parsing
│       └── code_runner.py       # Sandboxed Python code execution engine
├── frontend/
│   ├── index.html               # HTML entry with SEO meta tags
│   ├── package.json             # Node dependencies & scripts
│   ├── vite.config.js           # Vite + React + Tailwind config
│   ├── vercel.json              # Vercel deployment config
│   ├── .env.example             # Frontend env template
│   ├── public/
│   │   ├── favicon.svg          # App favicon
│   │   └── icons.svg            # UI icon sprites
│   └── src/
│       ├── main.jsx             # React entry point
│       ├── App.jsx              # Main app with state management
│       ├── index.css            # Design tokens, animations, custom styles
│       └── components/
│           ├── Header.jsx       # App header with logo & status badge
│           ├── CodeInput.jsx    # Code editor with line numbers & shortcuts
│           ├── ResultPanel.jsx  # Analysis results with quality ring
│           ├── BugList.jsx      # Severity-coded bug cards
│           └── OutputCompare.jsx # Before/After execution comparison
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Python** 3.11+
- **Node.js** 18+
- **Groq API Key** → [Get one free at console.groq.com](https://console.groq.com)

### 1. Clone the Repository

```bash
git clone https://github.com/Adarsh-T-04/CodeMedic-AI.git
cd CodeMedic-AI
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate        # macOS/Linux
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Start the server
uvicorn main:app --reload --port 8000
```

The API will be running at `http://localhost:8000`  
Interactive docs at `http://localhost:8000/docs`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Default points to http://127.0.0.1:8000

# Start dev server
npm run dev
```

The app will be running at `http://localhost:5173`

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GROQ_API_KEY` | ✅ Yes | — | Your Groq API key |
| `LOG_LEVEL` | ❌ | `INFO` | Logging level (DEBUG, INFO, WARNING, ERROR) |
| `CODE_RUN_TIMEOUT` | ❌ | `10` | Max seconds for code execution |
| `CORS_ORIGINS` | ❌ | `localhost:3000,5173,8080` | Comma-separated allowed origins |

### Frontend (`frontend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | ❌ | `http://127.0.0.1:8000` | Backend API base URL |

---

## 🔌 API Reference

### `POST /analyze`

Submit code for AI-powered analysis.

**Request:**
```json
{
  "code": "def greet(name)\n  print('Hello ' + name)",
  "language": "python"
}
```

**Response:**
```json
{
  "bugs": [
    { "line": 1, "issue": "Missing colon after function definition", "severity": "high" }
  ],
  "explanation": "The function definition is missing a colon...",
  "fixed_code": "def greet(name):\n    print('Hello ' + name)",
  "quality_score": 35,
  "original_output": { "output": "", "error": "SyntaxError: expected ':'" },
  "fixed_output": { "output": "Hello World", "error": "" }
}
```

### `GET /health`

Health check endpoint → `{ "status": "healthy", "service": "CodeMedic AI" }`

---

## 🌐 Deployment

### Backend → Render (Free Tier)

1. Connect GitHub repo on [render.com](https://render.com)
2. Set **Root Directory** → `backend`
3. **Build Command** → `pip install -r requirements.txt`
4. **Start Command** → `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add `GROQ_API_KEY` and `CORS_ORIGINS` env vars

### Frontend → Vercel (Free Tier)

1. Import repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** → `frontend`
3. Add `VITE_API_URL` → your Render backend URL

---

## 🛡️ Security

- API keys are stored in `.env` files (git-ignored)
- User code runs in **sandboxed subprocesses** with:
  - Timeout protection (default 10s)
  - Output size caps (50KB)
  - Stripped environment (no secrets leaked to user code)
- CORS is configured per-environment

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/Adarsh-T-04">Adarsh Tripathi</a>
</p>
