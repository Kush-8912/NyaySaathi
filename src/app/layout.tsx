import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Prevent flash of wrong theme on page load */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var t = localStorage.getItem('nyaysaathi-theme');
              if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.setAttribute('data-theme', 'dark');
              }
            } catch(e) {}
          })();
        `}} />
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider>
            <CustomCursor />
            <Navbar />
            <div style={{ position: 'relative', zIndex: 1, paddingTop: 0 }}>
              {children}
            </div>
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-primary)',
                  backdropFilter: 'blur(20px)',
                  fontFamily: "'Outfit', sans-serif",
                },
              }}
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
