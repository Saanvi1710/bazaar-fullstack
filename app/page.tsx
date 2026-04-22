"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { CategoryFilter } from "@/components/category-filter";
import { ProductGrid } from "@/components/product-grid";
import { Marquee } from "@/components/marquee";
import { ScrollAnimation } from "@/components/scroll-animation";
import { useSearch } from "@/lib/store-context";
import {
  Truck, Shield, RotateCcw, Headphones,
  Sparkles, Zap, Gift, Star, Heart, Award,
} from "lucide-react";

const features = [
  { icon: Truck, title: "Free Shipping", description: "On orders over ₹5,000" },
  { icon: Shield, title: "Secure Payment", description: "100% secure checkout" },
  { icon: RotateCcw, title: "Easy Returns", description: "30-day return policy" },
  { icon: Headphones, title: "24/7 Support", description: "Dedicated support team" },
];

const promoItems = [
  { icon: Sparkles, text: "Summer Sale - Up to 50% Off" },
  { icon: Zap, text: "Flash Deals Every Hour" },
  { icon: Gift, text: "Free Gift on Orders ₹10,000+" },
  { icon: Star, text: "New Arrivals Weekly" },
  { icon: Heart, text: "Member Exclusive Rewards" },
  { icon: Award, text: "Price Match Guarantee" },
];

const brands = ["Apple", "Samsung", "Sony", "Nike", "Adidas", "Puma", "LG", "Bose", "Canon", "Dell"];

function HomeContent() {
  const searchParams = useSearchParams();
  const { setSearchQuery, searchQuery, selectedCategory } = useSearch();

  useEffect(() => {
    const search = searchParams.get("search");
    if (search !== null && search !== searchQuery) {
      setSearchQuery(search);
    }
  }, [searchParams, setSearchQuery, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="border-b border-border bg-primary py-2.5 text-primary-foreground">
        <Marquee speed="normal" pauseOnHover>
          {promoItems.map((item, index) => (
            <div key={index} className="mx-8 flex items-center gap-2 text-sm font-medium">
              <item.icon className="h-4 w-4" />
              <span>{item.text}</span>
            </div>
          ))}
        </Marquee>
      </div>

      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
          <ScrollAnimation animation="fade-up">
            <div className="max-w-2xl">
              <h1 className="text-balance text-4xl font-semibold tracking-tight lg:text-5xl">
                Discover products you&apos;ll love
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Shop the latest trends with free shipping on orders over ₹5,000.
                Quality products, curated for you.
              </p>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8">
            {features.map((feature, index) => (
              <ScrollAnimation key={feature.title} animation="fade-up" delay={index * 100}>
                <div className="flex items-center gap-3 rounded-lg bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <ScrollAnimation animation="fade-up">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">
                {selectedCategory
                  ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)
                  : searchQuery
                    ? `Results for "${searchQuery}"`
                    : "All Products"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Browse our collection of quality products
              </p>
            </div>
          </div>
        </ScrollAnimation>
        <ScrollAnimation animation="fade-up" delay={100}>
          <CategoryFilter />
        </ScrollAnimation>
        <ScrollAnimation animation="fade-up" delay={200}>
          <div className="mt-6"><ProductGrid /></div>
        </ScrollAnimation>
      </section>

      <section className="border-y border-border bg-card py-8">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <ScrollAnimation animation="fade-in">
            <h3 className="mb-6 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Trusted by leading brands
            </h3>
          </ScrollAnimation>
          <Marquee speed="slow" pauseOnHover reverse>
            {brands.map((brand, index) => (
              <div key={index} className="mx-8 flex h-12 items-center justify-center px-4">
                <span className="text-xl font-semibold text-muted-foreground/60 transition-colors hover:text-foreground">
                  {brand}
                </span>
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <p className="text-sm text-muted-foreground">&copy; 2024 Bazaar. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="transition-colors hover:text-foreground">Privacy Policy</a>
              <a href="#" className="transition-colors hover:text-foreground">Terms of Service</a>
              <a href="#" className="transition-colors hover:text-foreground">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
