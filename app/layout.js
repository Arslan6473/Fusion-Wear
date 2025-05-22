import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AppProvider } from "@/context/AppContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Buy shirts pants and more",
  description: "Buy shirts pants and more",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="min-h-screen">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProvider>
          <GoogleOAuthProvider  clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
            <Navbar />
          </GoogleOAuthProvider>
          <Toaster/>
          {children}
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
