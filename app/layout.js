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
  description: "The premier platform for verified medical resources, clinical intelligence, and expert healthcare networking across Africa.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  keywords: ["medical", "healthcare", "Africa", "clinical", "doctors", "health tips", "medical intelligence"],
  authors: [{ name: "Med-Share Africa" }],
  openGraph: {
    title: "Med-Share Africa | Premium Health Intelligence",
    description: "The premier destination for elite African healthcare professionals.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playFair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans text-slate-100 bg-[#050505] selection:bg-amber-500 selection:text-[#050505]">
        <Provider>
          <Navbar />
          {children}
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
