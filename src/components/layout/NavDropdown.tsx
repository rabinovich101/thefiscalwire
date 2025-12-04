"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { NavCategory } from "@/config/navigation";

interface NavDropdownProps {
  category: NavCategory;
}

export function NavDropdown({ category }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150); // Small delay to prevent flickering
  };

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {category.label}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[220px] rounded-md border border-border bg-background p-2 shadow-lg">
          <div className="flex flex-col">
            {category.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col rounded-md px-3 py-2 hover:bg-muted transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-sm font-medium text-foreground group-hover:text-primary">
                  {item.label}
                </span>
                {item.description && (
                  <span className="text-xs text-muted-foreground">
                    {item.description}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
