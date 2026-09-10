import type { Metadata, Viewport } from 'next';
import { Fredoka, Dancing_Script } from 'next/font/google';
import './globals.css';
import { AudioProvider } from '@/components/AudioProvider';

const fredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-fredoka',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing-script',
  display: 'swap',
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  title: 'How much do you love me? 💕 | Romantic Love Test',
  description: 'An interactive romantic digital gift card with surprises, roses, music, and a heartfelt letter.',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fredoka.variable} ${dancingScript.variable}`}>
      <body className="min-h-screen bg-[#FDE8EB] text-[#6B1A3A] font-sans antialiased selection:bg-[#F472B6] selection:text-white flex flex-col items-center justify-between relative overflow-x-hidden">
        <AudioProvider>
          <main className="w-full max-w-4xl min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 mx-auto relative">
            {children}
          </main>
        </AudioProvider>
      </body>
    </html>
  );
}
