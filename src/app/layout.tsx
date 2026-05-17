import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/components/providers/AuthProvider';
import Navbar from '@/components/layout/Navbar';
import CustomCursor from '@/components/animations/CustomCursor';

export const metadata: Metadata = {
  title: 'NyaySaathi — AI Contract Intelligence for India',
  description: 'NyaySaathi reads your contracts, spots hidden risks, explains real-world consequences in plain English, and tells you exactly what to negotiate. Free. Built for India.',
  keywords: 'contract analysis India, legal AI, employment contract check, rental agreement risk, NyaySaathi',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'NyaySaathi — Read Before You Sign',
    description: 'AI-powered contract intelligence. Know before you agree.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AuthProvider>
          <CustomCursor />
          <Navbar />
          <div style={{ position: 'relative', zIndex: 1, paddingTop: 0 }}>
            {children}
          </div>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'rgba(14,14,26,0.97)',
                border: '1px solid rgba(99,102,241,0.25)',
                color: '#F0EDFF',
                backdropFilter: 'blur(20px)',
                fontFamily: "'Outfit', sans-serif",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
