"use client";

import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/data/mockData";
import { useUIStore } from "@/stores";

export function Header() {
  const { isMobileMenuOpen, setMobileMenuOpen, toggleMobileMenu } = useUIStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center">
            <span className="text-xl font-bold tracking-tight text-white">
              Finance<span className="text-primary">News</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Subscribe Button */}
          <Button
            variant="default"
            className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            Subscribe
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-muted-foreground hover:text-foreground"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background">
          <nav className="flex flex-col px-4 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-2 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground border-b border-border/40 last:border-0"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Button
              variant="default"
              className="mt-3 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              Subscribe
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
