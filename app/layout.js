import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";
import NavBar from "@/components/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "VoDet - VoIP Classifier",
  description: "A web application for classifying VoIP traffic using machine learning.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProvider>
          <NavBar />
          {children}</AppProvider>
      </body>
    </html>
  );
}
