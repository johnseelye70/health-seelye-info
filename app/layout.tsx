import type { Metadata, Viewport } from 'next';
import './globals.css';
import { HealthProvider } from '@/context/HealthContext';

export const metadata: Metadata = {
  title: 'Seelye Family Health | Precision Nutrition & Adaptive Fitness Engine',
  description:
    'High-end athletic performance platform featuring Mifflin-St Jeor TDEE macro calculation, intermittent fasting window timers, equipment-filtered 4-week workout periodization, and automated grocery requisitions.',
  applicationName: 'Seelye Family Health',
  authors: [{ name: 'Seelye Health Engineering' }],
  keywords: [
    'fitness',
    'nutrition',
    'macro calculator',
    'intermittent fasting',
    'workout split',
    'grocery manager',
    'mifflin st jeor',
  ],
  metadataBase: new URL('https://health.seelye.info'),
};

export const viewport: Viewport = {
  themeColor: '#090a0f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased selection:bg-brand-500 selection:text-zinc-950 font-sans min-h-screen">
        <HealthProvider>{children}</HealthProvider>
      </body>
    </html>
  );
}
