import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

const poppins = Poppins({ subsets: ['latin'],weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}