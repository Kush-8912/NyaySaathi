# NyaySaathi

NyaySaathi is an AI-powered contract analysis platform built for the Indian context. Upload any legal document — employment contract, rental agreement, NDA, freelance deal — and get a plain-language risk breakdown, clause-by-clause analysis, and negotiation recommendations in seconds.

**Live demo:** https://nyay-saathi-j4af.vercel.app/

---

## Features

- Upload PDF, DOCX, or TXT contracts, or paste text directly
- 6-agent AI pipeline for clause extraction, risk scoring, and explanation
- Risk score (0–100) with dimension-level breakdown
- Plain English and Hinglish explanations
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
| AI | Google Gemini 1.5 Flash |
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

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

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
2. Generate an API key and add it to `.env.local` as `NEXT_PUBLIC_GEMINI_API_KEY`

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Legal disclaimer

NyaySaathi provides legal awareness and educational information only. It is not a law firm and does not provide legal advice. Always consult a qualified legal professional before making legal decisions.
