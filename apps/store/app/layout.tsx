import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { PrototypeBanner } from '@prototype/ui';

export const metadata: Metadata = {
  title: 'Prototype Security Store - Student Project',
  description: 'Academic prototype for security hardware and installation service integration.',
  robots: {
    index: false,
    follow: false
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <PrototypeBanner />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
