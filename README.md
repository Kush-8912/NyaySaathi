# NyaySaathi

NyaySaathi is an AI-powered contract analysis platform built for the Indian context. Upload any legal document — employment contract, rental agreement, NDA, freelance deal — and get a plain-language risk breakdown, clause-by-clause analysis, and negotiation recommendations in seconds.

**Live demo:** https://nyay-saathi-j4af.vercel.app/

---

## Features

- Upload PDF, DOCX, or TXT contracts, or paste text directly
- 6-agent AI pipeline for clause extraction, risk scoring, and explanation
- Risk score (0–100) with dimension-level breakdown
- Plain English and simplified explanations
- Worst-case scenario simulations
- Negotiation recommendations with suggested wording
- PDF report export
- Analysis history with search and filter
- Firebase authentication (email/password + Google OAuth)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | Radix UI, Lucide React |
| Animations | Framer Motion |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| AI | Google Gemini 2.5 Flash (called from a server-side API route) |
| Auth | Firebase Authentication |
| Database | Firebase Firestore |
| Storage | Firebase Storage |
| PDF parsing | pdfjs-dist |
| DOCX parsing | mammoth |
| PDF export | jsPDF |
| Deployment | Vercel |

---

## Setup

### 1. Clone and install

```bash
git clone https://github.com/Kush-8912/NyaySaathi.git
cd NyaySaathi
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` in the project root and fill it in:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

GEMINI_API_KEY=your_gemini_api_key
```

`GEMINI_API_KEY` is a secret. It is only read on the server (`src/app/api/analyze/route.ts`), so do **not** give it a `NEXT_PUBLIC_` prefix, which would expose it in the browser.

### 3. Firebase setup

1. Go to the [Firebase Console](https://console.firebase.google.com) and create a project
2. Enable **Authentication** → Email/Password and Google provider
3. Enable **Firestore Database** (production mode)
4. Enable **Storage**
5. Deploy security rules:
   ```bash
   firebase deploy --only firestore:rules,storage
   ```

### 4. Gemini API key

1. Go to [Google AI Studio](https://aistudio.google.com)
2. Generate an API key and add it to `.env.local` as `GEMINI_API_KEY`

### 5. Deploying to Vercel

Add the same variables under **Project → Settings → Environment Variables** (with `GEMINI_API_KEY`, not `NEXT_PUBLIC_GEMINI_API_KEY`) and redeploy. Contract analysis can take up to a minute; the API route allows 60 seconds.

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Legal disclaimer

NyaySaathi provides legal awareness and educational information only. It is not a law firm and does not provide legal advice. Always consult a qualified legal professional before making legal decisions.
