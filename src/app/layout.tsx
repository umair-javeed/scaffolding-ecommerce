import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { WhatsAppFloatingButton } from '@/components/WhatsAppFloatingButton'; // ⬅️ ADD THIS LINE
import '@/lib/amplify-config';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Javed Scaffolding Pipe Store',
  description: 'Professional scaffolding materials at competitive prices',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
            
            {/* ⬇️ ADD THIS - WhatsApp Floating Button */}
            <WhatsAppFloatingButton 
              phoneNumber="923004854418"  // ⚠️ REPLACE with your WhatsApp Business number
              message="Hi! I'm interested in your scaffolding products. Can you help me?"
              position="bottom-right"
            />
            {/* ⬆️ END OF ADDITION */}
            
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}