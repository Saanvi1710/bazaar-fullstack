"use client";

import {
  Laptop,
  Shirt,
  Home,
  Dumbbell,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { categories } from "@/lib/mock-data";
import { useSearch } from "@/lib/store-context";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Laptop,
  Shirt,
  Home,
  Dumbbell,
  BookOpen,
  Sparkles,
};

export function CategoryFilter() {
  const { selectedCategory, setCategory } = useSearch();

  return (
    <div className="w-full">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-3">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setCategory(null)}
            className="shrink-0"
          >
            All Products
          </Button>
          {categories.map((category) => {
            const Icon = iconMap[category.icon];
            return (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                size="sm"
                onClick={() => setCategory(category.id)}
                className={cn(
                  "shrink-0 gap-2",
                  selectedCategory === category.id &&
                    "bg-primary text-primary-foreground"
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {category.name}
              </Button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
