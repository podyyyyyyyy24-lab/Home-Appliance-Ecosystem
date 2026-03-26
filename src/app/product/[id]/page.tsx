import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductDisplay } from "./ProductDisplay";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Zap } from "lucide-react";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id },
    include: { variants: true }
  });

  if (!product) {
    return notFound();
  }

  return (
    <div className="min-h-screen flex flex-col pt-4">
      <header className="px-6 py-5 flex justify-between items-center max-w-7xl mx-auto w-full mb-8">
        <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-transform">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(var(--primary),0.5)]">
            <Zap className="text-white w-5 h-5 fill-current" />
          </div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Home Kitchen Store<span className="text-yellow-500">.</span></h1>
        </Link>
        <div className="flex gap-4 items-center">
          <ThemeToggle />
        </div>
      </header>
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-5">
        <ProductDisplay product={product} />
      </main>
    </div>
  );
}
