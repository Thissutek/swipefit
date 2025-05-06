import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Stylish Threads - Modern Clothing Store',
  description: 'Shop the latest fashion trends with our modern clothing store.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-center" />
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
