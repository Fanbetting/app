import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/lib/hooks/providers/theme-provider";
import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";
import WalletProvider from "@/lib/hooks/providers/wallet-provider";

const geistSans = localFont({
  src: "../lib/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../lib/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Fanbet Demo",
  description: "Lottery App Demo by Simon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >

          <WalletProvider>

            <div className="flex min-h-screen flex-col items-center justify-between">
              <Header />
              {children}
              <Footer />
            </div>

          </WalletProvider >
        </ThemeProvider>

        <Toaster />
      </body>
    </html >
  );
}
