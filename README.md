# NyaySaathi ⚖️

> **Read before you sign. Understand before you agree.**

NyaySaathi is a multi-agent contract intelligence platform that analyzes legal documents, detects harmful clauses, scores risk, explains implications in plain English/Hinglish, and generates negotiation-ready recommendations.

---

## 🎯 Problem Statement

Most people sign employment contracts, rental agreements, freelance deals, subscriptions, NDAs, and terms of service without truly understanding the consequences. Exploitative clauses, overly broad non-competes, one-sided arbitration, automatic renewals, and IP grabs are common — and costly.

**NyaySaathi fixes this.**

---

## 🚀 Features

### Core
- 📄 Upload PDF, DOCX, or TXT contracts
- ✏️ Paste contract text directly
- 🤖 6-agent AI reasoning pipeline
- 📊 Overall risk score (0–100) with risk level
- 🔍 Clause-by-clause risk analysis
- 🇮🇳 Hinglish explanations for Indian users

### Risk Intelligence
- Non-compete / non-solicit detection
- Broad IP ownership identification
- One-sided arbitration analysis
- Privacy & data collection risks
- Financial liability & penalty detection
- Termination risk scoring
- Ambiguity detection
- Missing protection identification

### Reports
- Visual risk gauge
- Risk dimension radar charts
- Scenario simulations (worst-case)
- Negotiation plan with suggested wording
- Interactive pre-signing question checklist
- PDF report export (jsPDF)
- Copy/share summary

### Platform
- Firebase Authentication (email/password + Google OAuth)
- Protected routes
- Analysis history with search/filter
- Dashboard with stats and analytics
- Insights page with trend charts
- Account page with profile picture upload
- Firestore for persistent reports
- Firebase Storage for file uploads

---

## 🧠 AI Architecture — 6 Agents

| Agent | Role |
|---|---|
| **Clause Extractor** | Identifies and categorizes all legal provisions |
| **Risk Analyst** | Scores severity across 7 risk dimensions |
| **Adversarial Reasoner** | Surfaces hidden exploitation and worst-case scenarios |
| **Plain Language Explainer** | Translates legalese into English and Hinglish |
| **Negotiation Coach** | Suggests better wording and strategies |
| **Report Builder** | Compiles the structured intelligence report |

Powered by **Google Gemini 1.5 Flash** with intelligent JSON repair and mock fallback so the demo never breaks.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + custom design system |
| Animations | Framer Motion + custom CSS |
| UI Components | Radix UI primitives |
| Icons | Lucide React |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Auth | Firebase Authentication |
| Database | Firebase Firestore |
| Storage | Firebase Storage |
| AI | Google Gemini 1.5 Flash |
| PDF | pdfjs-dist |
| DOCX | mammoth |
| Export | jsPDF |
| Notifications | Sonner |
| Deployment | Vercel-ready |

---

## ⚙️ Setup

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/nyaysaathi
cd nyaysaathi/nyaysaathi
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication** → Email/Password and Google provider
4. Enable **Firestore Database** (start in production mode)
5. Enable **Storage**
6. Deploy security rules:

```bash
firebase deploy --only firestore:rules,storage
```

### 4. Gemini Setup

1. Go to [Google AI Studio](https://aistudio.google.com)
2. Create an API key
3. Add to `.env.local` as `NEXT_PUBLIC_GEMINI_API_KEY`

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🎬 Demo Flow (2 Minutes)

1. Open landing page — show animated hero with gradient effects
2. Click **"Analyze a Contract"** → redirect to signup
3. Create account — show live password strength checklist
4. Land on dashboard — show greeting, empty state
5. Navigate to **Analyze** page
6. Click **"Load demo contract →"** (auto-fills employment contract)
7. Settings: Employment / Employee / Hinglish
8. Click **"Analyze with AI"** — show 6-agent thinking animation
9. View report:
   - Risk score gauge (84/100 — Critical)
   - Non-compete red flag (24-month global)
   - IP ownership risk
   - One-sided arbitration
   - Plain English + Hinglish explanation
   - Worst-case scenario simulations
   - Negotiation plan with suggested wording
   - Pre-signing questions checklist
10. Click **Download Report** — PDF generated
11. Show **Dashboard** — stats updated
12. Show **History** page — search/filter
13. Show **Insights** — trend chart
14. Show **Account** — upload profile picture

---

## 🏆 Judging Criteria Mapping

### Technical Depth
- Next.js 16 App Router + TypeScript
- Firebase Auth, Firestore, Storage with security rules
- Protected routes and middleware
- Document upload + extraction (PDF, DOCX, TXT)
- AI service abstraction with Gemini + mock fallback
- Dashboard analytics with Recharts
- PDF report export with jsPDF
- Clean modular architecture

### AI Integration Depth
- 6-agent multi-role reasoning in a single optimized prompt
- Clause extraction and classification (20+ categories)
- Risk scoring across 7 dimensions
- Adversarial reasoning (worst-case thinking)
- Ambiguity and one-sidedness detection
- Plain English + Hinglish explanation
- Scenario simulation
- Negotiation recommendation
- Safer clause rewriting
- AI fallback with realistic mock data

### Execution Quality
- Fully animated dark-mode UI (glassmorphism, gradient mesh, custom cursor)
- Working auth (email/password + Google OAuth)
- Working upload/paste analysis
- Visual report dashboard
- Clean loading/error states
- Fully mobile responsive
- Live demo data (5 contract examples)
- PDF export
- Comprehensive README

---

## 🔮 Future Scope

- [ ] OCR for scanned PDFs (Tesseract.js)
- [ ] Contract comparison ("Is version 2 better than version 1?")
- [ ] Multi-language support (Tamil, Telugu, Hindi)
- [ ] Lawyer marketplace integration
- [ ] WhatsApp bot for quick clause checks
- [ ] Browser extension for real-time ToS analysis
- [ ] Contract template library
- [ ] Team accounts for startups and law firms

---

## ⚖️ Legal Disclaimer

NyaySaathi provides legal awareness and educational information only. It is **not a law firm** and does not provide legal advice. Analysis is AI-generated and may not be accurate or complete. Always consult a qualified legal professional before making legal decisions.

---

## 🎤 2-Minute Pitch Script

> "Most people sign contracts without truly understanding the consequences. Employment agreements, rental contracts, freelance deals, subscriptions, privacy policies, and terms of service often hide restrictive clauses, financial liabilities, broad IP transfers, one-sided arbitration, automatic renewals, and privacy risks.
>
> NyaySaathi solves this by acting as a multi-agent contract intelligence system. It extracts important clauses, classifies legal risks, simulates real-world consequences, explains them in plain English and Hinglish, scores severity, and generates negotiation-ready recommendations.
>
> Firebase powers authentication, secure document storage, real-time user history, and protected reports. Gemini powers the legal reasoning workflow.
>
> NyaySaathi does not replace lawyers — it gives users legal awareness before they sign."

---

Built with ❤️ for **PromptWars by Scaler School of Technology**
