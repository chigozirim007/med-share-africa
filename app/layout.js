import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Provider from "@/components/Provider";

const playFair = Playfair_Display({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: '--font-playfair',
});

const inter = Inter({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: '--font-inter',
});

export const metadata = {
  title: "Med-Share Africa | Premium Health Intelligence",
  description: "A luxury platform for verified medical resources and expert networking.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playFair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans text-slate-100 bg-[#0A0F1C] selection:bg-cyan-500 selection:text-[#0A0F1C]">
        <Provider>
          <Navbar />
          {children}
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
