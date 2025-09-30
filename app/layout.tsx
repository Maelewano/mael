import { ThemeProvider } from 'next-themes';
import "./globals.css";
import Navbar from '@/app/Components/Navbar/Navbar';
import Footer from'@/app/Components/Footer/Footer';
import {fontSans} from '@/app/config/font';
import {metadata} from '@/app/config/metadata';

export {metadata}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
