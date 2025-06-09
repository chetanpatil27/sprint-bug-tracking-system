import { Outfit } from 'next/font/google';
import './globals.css';

import AppProvider from './provide';

const outfit = Outfit({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
