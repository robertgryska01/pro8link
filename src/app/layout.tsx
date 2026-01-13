// File: src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import 'react-day-picker/dist/style.css';
import { Toaster } from '@/components/ui/toaster';
import { GoogleAuthGate } from '@/components/auth/GoogleAuthGate';

export const metadata: Metadata = {
  title: 'ProLink',
  description: 'ProLink Dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <GoogleAuthGate>
          {children}
        </GoogleAuthGate>
        <Toaster />
      </body>
    </html>
  );
}
