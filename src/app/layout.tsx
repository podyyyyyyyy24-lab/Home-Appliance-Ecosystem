import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CartProvider } from "@/components/CartProvider";
import { CartDrawer } from "@/components/CartDrawer";
import { CartFloatingButton } from "@/components/CartFloatingButton";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PhoneHub Store | متجر الهواتف والإكسسوارات والاسكرينات",
    template: "%s | PhoneHub Store",
  },
  description: "وجهتك الأولى لأحدث الهواتف الذكية، اسكرينات الحماية المعتمدة، الجرابات والشواحن الأصلية مع الدفع عند الاستلام وضمان حقيقي.",
  keywords: ["موبايلات", "هواتف ذكية", "اسكرينات", "جرابات", "شواحن سريعة", "اكسسوارات موبايل", "phonehub store", "مصر"],
  authors: [{ name: "PhoneHub Store" }],
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "https://phonehub-store.vercel.app/",
    title: "PhoneHub Store | فون هاب ستور",
    description: "أفضل الهواتف الذكية ومستلزمات الحماية والإكسسوارات الأصلية مع خدمة التوصيل لجميع المحافظات والدفع عند الاستلام.",
    siteName: "PhoneHub Store",
    images: [
      {
        url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "PhoneHub Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PhoneHub Store",
    description: "أحدث الموبايلات والإكسسوارات والاسكرينات الأصلية - دفع عند الاستلام",
    images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80&auto=format&fit=crop"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Use suppressHydrationWarning to stop Next.js warnings about theme classes injected by next-themes on the HTML tag
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className="h-full antialiased">
      <body className={`${cairo.className} min-h-full flex flex-col bg-background text-foreground transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CartProvider>
            {children}
            <CartDrawer />
            <CartFloatingButton />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
