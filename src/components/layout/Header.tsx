"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X, User, LogOut, Sun, Moon, Settings, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigationConfig, directLinks } from "@/config/navigation";
import { useUIStore } from "@/stores";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { SearchModal } from "./SearchModal";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { NavDropdown } from "./NavDropdown";

export function Header() {
  const { isMobileMenuOpen, setMobileMenuOpen, toggleMobileMenu } = useUIStore();
  const { data: session, status } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);

  const toggleMobileDropdown = (label: string) => {
    setOpenMobileDropdown(openMobileDropdown === label ? null : label);
  };

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none"
      >
        Skip to main content
      </a>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center">
            <span className="text-xl font-bold tracking-tight text-foreground">
              The Fiscal<span className="text-primary">Wire</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navigationConfig.map((category) => (
            <NavDropdown key={category.label} category={category} />
          ))}
          {directLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
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
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Auth Buttons */}
          {status === "loading" ? (
            <div className="hidden sm:flex items-center gap-2">
              <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
            </div>
          ) : session ? (
            <div className="hidden sm:flex items-center">
              <UserProfileDropdown user={session.user} />
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                >
                  Sign up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-muted-foreground hover:text-foreground"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
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
        <div id="mobile-menu" className="md:hidden border-t border-border/40 bg-background">
          <nav className="flex flex-col px-4 py-2">
            {/* Mobile Dropdown Categories */}
            {navigationConfig.map((category) => (
              <div key={category.label} className="border-b border-border/40">
                <button
                  onClick={() => toggleMobileDropdown(category.label)}
                  className="flex w-full items-center justify-between px-2 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  aria-expanded={openMobileDropdown === category.label}
                >
                  {category.label}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      openMobileDropdown === category.label ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openMobileDropdown === category.label && (
                  <div className="pb-2 pl-4">
                    {category.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-2 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setOpenMobileDropdown(null);
                        }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {/* Direct Links */}
            {directLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-2 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground border-b border-border/40 last:border-0"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {session ? (
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-3 px-2 py-3 bg-muted/50 rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary text-sm font-medium">
                      {session.user?.name?.substring(0, 2).toUpperCase() ||
                       session.user?.email?.substring(0, 2).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {session.user?.name || session.user?.email?.split("@")[0]}
                    </span>
                    {session.user?.email && (
                      <span className="text-xs text-muted-foreground">
                        {session.user.email}
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  href="/account/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-sm font-medium text-foreground rounded-md hover:bg-muted transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Account Settings
                </Link>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut();
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign in
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="default"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                  >
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
    <SearchModal open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  );
}
