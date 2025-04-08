import type { Metadata } from 'next';

import { Geist, Geist_Mono } from 'next/font/google';

import DeviceProvider from '@/components/DeviceProvider';
import ThemeProvider from '@/components/ThemeProvider';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'schnode',
  description:
    'A GUI tool for effortlessly building and customizing no-code apps using shadcn/ui components',
};

function ThemeScript() {
  const themeScript = `
    (function() {
      try {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {
        console.error('Failed to access localStorage for theme:', e);
      }
    })()
  `;

  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <ThemeScript />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}
      >
        <DeviceProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </DeviceProvider>
      </body>
    </html>
  );
}
