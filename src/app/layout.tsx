import type { Metadata } from "next";
import LayoutShell from "@/components/LayoutShell";
import { MarketplaceProvider } from "@/context/MarketplaceContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sefed Market (ሰፌድ ገበያ) | Shop Smart · Live Better",
  description: "Ethiopia's premier e-commerce marketplace and device barter exchange with secure Telebirr and CBE escrow across Addis Ababa, Adama, Hawassa, and nationwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html, body {
                background-color: #f8fafc;
                color: #0f172a;
                font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                margin: 0;
                padding: 0;
              }
              img {
                max-width: 100%;
                height: auto;
              }
            `,
          }}
        />
      </head>
      <body className="bg-[#f8fafc] text-[#0f172a] antialiased min-h-screen flex flex-col">
        <MarketplaceProvider>
          <LayoutShell>{children}</LayoutShell>
        </MarketplaceProvider>
      </body>
    </html>
  );
}
