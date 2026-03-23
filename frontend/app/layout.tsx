'use client';

import { Inter } from 'next/font/google'
import Sidebar from './components/Sidebar'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext';
import { FraudProvider } from '@/context/FraudContext';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <html lang="en">
<<<<<<< HEAD
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
=======
      <body className={`${inter.className} bg-background text-foreground antialiased`} suppressHydrationWarning>
>>>>>>> jiya
        <AuthProvider>
          <FraudProvider>
            <div className="flex relative">
            {/* Ambient Background Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[150px] -z-10 rounded-full" />
            <div className="fixed bottom-[-5%] right-[5%] w-[35%] h-[35%] bg-secondary/15 blur-[120px] -z-10 rounded-full" />
            
            {!isAuthPage && <Sidebar aria-label="Main navigation" />}
            <main className={`flex-1 min-h-screen transition-all ${isAuthPage ? 'ml-0' : 'ml-[280px]'}`}>
              {children}
            </main>
          </div>
        </FraudProvider>
      </AuthProvider>
    </body>
  </html>
)
}
