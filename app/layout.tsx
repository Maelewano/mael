import "./globals.css";
import Navbar from '@/app/Components/Navbar/Navbar';
import Footer from'@/app/Components/Footer/Footer';
import ScrollToTop from '@/app/Components/UI/scroll-to-top';
import {fontSans} from '@/app/config/font';
import {metadata} from '@/app/config/metadata';

export {metadata}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontSans.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
