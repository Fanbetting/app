import Footer from "@/components/shared/app-footer";
import Header from "@/components/shared/app-header";
import AssetProvider from "@/components/shared/asset-provider";
import { Toaster } from "@/components/ui/toaster";
import { AccountProvider } from "@/lib/hooks/providers/account-provider";
import { ThemeProvider } from "@/lib/hooks/providers/theme-provider";
import WalletProvider from "@/lib/hooks/providers/wallet-provider";
import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

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
  title: "Fanbet Lottery",
  description: "Lottery App Powered by Algorand",
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
            <AccountProvider>
              <AssetProvider>
                <div className="flex min-h-screen flex-col">
                  <Header />
                  {children}
                  <Footer />
                </div>
              </AssetProvider>
            </AccountProvider>
          </WalletProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
