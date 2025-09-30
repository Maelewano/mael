import { Geist, Geist_Mono, Plus_Jakarta_Sans as FontSans } from 'next/font/google';

export const fontSans = FontSans({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-sans",
});