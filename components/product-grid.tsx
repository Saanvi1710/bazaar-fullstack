"use client";

import useSWR from "swr";
import { ProductCard, ProductCardSkeleton } from "./product-card";
import { ScrollAnimation } from "./scroll-animation";
import { fetchProducts } from "@/lib/mock-data";
import { useSearch } from "@/lib/store-context";
import { PackageX } from "lucide-react";

export function ProductGrid() {
  const { selectedCategory, searchQuery } = useSearch();

  const { data: products, isLoading } = useSWR(
    ["products", selectedCategory, searchQuery],
    () => fetchProducts(selectedCategory, searchQuery),
    { revalidateOnFocus: false }
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <PackageX className="mb-4 h-16 w-16 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-medium">No products found</h3>
        <p className="text-sm text-muted-foreground">
          Try adjusting your search or filter to find what you&apos;re looking
          for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <ScrollAnimation
          key={product.id}
          animation="fade-up"
          delay={(index % 4) * 75}
        >
          <ProductCard product={product} />
        </ScrollAnimation>
      ))}
    </div>
  );
}
