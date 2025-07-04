import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Blog - Bala@Dev",
  icons: {
    icon: "/favicon.png", // or "/favicon.ico"
  },
  description: "My Personalized Blog Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-gray-100 dark:bg-gray-800 text-black dark:text-gray-100 overflow-x-hidden">
          <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40">
            <Navbar />
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
