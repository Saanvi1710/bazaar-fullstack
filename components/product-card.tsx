"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart, type Product } from "@/lib/store-context";
import { formatPrice } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addToCart } = useCart();
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <Card
      className={cn(
        "group overflow-hidden border-border/50 transition-all duration-300 hover:border-border hover:shadow-lg",
        className
      )}
    >
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {discount > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-accent px-2 py-1 text-xs font-medium text-accent-foreground">
              -{discount}%
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <span className="rounded-md bg-muted px-3 py-1 text-sm font-medium">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="mb-2">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {product.category}
          </span>
        </div>

        <Link href={`/product/${product.id}`}>
          <h3 className="line-clamp-2 text-sm font-medium leading-tight transition-colors hover:text-muted-foreground">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3 w-3",
                  i < Math.floor(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-muted text-muted"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount.toLocaleString()})
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 transition-colors hover:bg-primary hover:text-primary-foreground"
            onClick={(e) => {
              e.preventDefault();
              if (product.inStock) {
                addToCart(product);
              }
            }}
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="sr-only">Add to cart</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square animate-pulse bg-muted" />
      <CardContent className="p-4">
        <div className="mb-2 h-3 w-16 animate-pulse rounded bg-muted" />
        <div className="mb-1 h-4 w-full animate-pulse rounded bg-muted" />
        <div className="mb-2 h-4 w-2/3 animate-pulse rounded bg-muted" />
        <div className="mb-3 h-3 w-24 animate-pulse rounded bg-muted" />
        <div className="flex items-center justify-between">
          <div className="h-6 w-20 animate-pulse rounded bg-muted" />
          <div className="h-8 w-8 animate-pulse rounded bg-muted" />
        </div>
      </CardContent>
    </Card>
  );
}
