# NyaySaathi ⚖️ • AI Contract Intelligence for India

<div align="center">
  <p><strong>Read before you sign. Understand before you agree.</strong></p>
  <p>NyaySaathi is a sophisticated AI-driven legal intelligence platform designed to decode complex contracts, detect unfair clauses, and highlight hidden risks specifically tailored for the Indian legal context.</p>
</div>

---

## 🎯 Problem Statement
Most people sign employment contracts, rental agreements, freelance deals, subscriptions, NDAs, and terms of service without truly understanding the consequences. Exploitative clauses, overly broad non-competes, one-sided arbitration, automatic renewals, and IP grabs are common — and costly.

**NyaySaathi acts as your personal AI legal assistant, giving you complete legal awareness before you put pen to paper.**

---

## 🚀 Key Features

### 🧠 Core Analysis
- **Format Support**: Upload PDF, DOCX, or TXT contracts, or paste text directly.
- **6-Agent AI Pipeline**: Powered by Gemini 1.5, simulating Clause Extractors, Risk Analysts, and Negotiation Coaches.
- **Bilingual Explanations**: Explains legalese in Plain English & **Hinglish** for maximum clarity.

### ⚠️ Risk Intelligence
- **Scoring**: Calculates an overall Risk Score (0-100) and severity gauge.
- **Clause Detection**: Flags non-competes, broad IP ownership, one-sided arbitration, privacy risks, financial liabilities, and hidden penalties.
- **Scenario Simulation**: Simulates "worst-case scenarios" so you understand the real-world impact.
- **Actionable Advice**: Provides a negotiation plan with suggested safer wording.

### 🛡️ Platform & Security
- **Authentication**: Firebase Email/Password & Google OAuth.
- **Custom Security Flows**: Includes an advanced "Forgot Password" intercept flow and strict `PasswordChecklist` validation.
- **Cloud Storage & Database**: Persistent storage for analysis history, PDF reports, and profile avatars using Firestore and Firebase Storage.
- **Premium UI**: Cinematic dark-themed interface built with Next.js, Tailwind CSS, and Framer Motion.

---

## 📂 Project Structure

```text
NyaySaathi/
├── public/                 # Static assets (images, icons, mock contracts)
├── src/
│   ├── app/                # Next.js 15 App Router pages
│   │   ├── (auth)/         # login, signup, forgot-password, reset-password
│   │   ├── dashboard/      # User dashboard & statistics
│   │   ├── analyze/        # Main contract analysis engine
│   │   ├── history/        # Past reports & filtering
│   │   ├── insights/       # Trend analytics
│   │   └── account/        # Profile settings & avatar uploads
│   ├── components/         # Reusable React components
│   │   ├── auth/           # Login/Signup forms, PasswordChecklist, GoogleButton
│   │   ├── layout/         # Navbar, Sidebar, ProtectedRoute wrappers
│   │   ├── report/         # Risk gauges, Clause cards, PDF Export button
│   │   └── ui/             # Generic buttons, modals, loaders
│   ├── hooks/              # Custom React hooks (useAuth, useUserProfile)
│   ├── lib/                # Core utilities
│   │   ├── ai/             # Gemini API integrations and agent logic
│   │   ├── firebase/       # Firebase config, auth, firestore, storage wrappers
│   │   └── validations/    # Zod schemas for form validation
│   └── types/              # TypeScript interfaces (Analysis, User, Contract)
├── .env.example            # Environment variables template
├── tailwind.config.ts      # Tailwind configuration
└── package.json            # Project dependencies
```

---

## ⚙️ Local Setup Guide

Follow these steps to run the application perfectly on your local machine.

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **Git**
- A **Firebase Account** (Free tier is fine)
- A **Google AI Studio Account** (For the Gemini API Key)

### 2. Clone the Repository
```bash
git clone https://github.com/yourusername/SafarSang.git
cd SafarSang
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Setup Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new project named **NyaySaathi**.
3. **Enable Authentication**: Add "Email/Password" and "Google" as sign-in providers.
4. **Enable Firestore Database**: Create a database (start in production or test mode).
5. **Enable Firebase Storage**: Initialize the storage bucket.
6. **Update Security Rules**: In the Firestore and Storage tabs, ensure your rules allow authenticated users to read/write their own data.

*Firebase Storage Rule Example for Avatars:*
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Setup Environment Variables
Duplicate the `.env.example` file and rename it to `.env.local`.

```bash
cp .env.example .env.local
```

Fill in your keys. You can find your Firebase keys in **Project Settings** > **General** > **Your Apps** (Web config).

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# AI Configuration (Get from aistudio.google.com)
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

### 6. Custom Password Reset Flow (Optional but Recommended)
To make the "Forgot Password" flow redirect back to the app instead of Firebase's default page:
1. Go to Firebase Console > Authentication > **Templates**.
2. Click **Password reset** and edit it (pencil icon).
3. Click **Customize action URL** and set it to: `http://localhost:3000/reset-password`.

### 7. Run the Application
```bash
npm run dev
```
The app will be available at [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Tech Stack

* **Frontend:** Next.js 15 (App Router), React 19, TypeScript
* **Styling:** Tailwind CSS, Custom Glassmorphism, Framer Motion
* **Database & Auth:** Firebase (Firestore, Storage, Authentication)
* **AI Engine:** Google Gemini 1.5 Flash via `@google/genai`
* **Parsing & Export:** `pdfjs-dist` (PDF parsing), `mammoth` (DOCX), `jspdf` & `html2canvas` (PDF Generation)
* **Icons & Notifications:** Lucide React, Sonner

---

## ⚖️ Legal Disclaimer

NyaySaathi provides legal awareness and educational information only. It is **not a law firm** and does not provide legal advice. Analysis is AI-generated and may not be 100% accurate or complete. Always consult a qualified legal professional before making major legal decisions.

---
Built with ❤️ for **PromptWars by Scaler School of Technology**
