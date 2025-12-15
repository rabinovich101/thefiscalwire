import Link from "next/link";
import { Twitter, Linkedin, Youtube } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  company: [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Careers", href: "/careers" },
    { name: "Advertise", href: "/advertise" },
  ],
  legal: [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Cookie Policy", href: "/cookies" },
  ],
  sections: [
    { name: "US Markets", href: "/category/us-markets" },
    { name: "Tech", href: "/category/tech" },
    { name: "Crypto", href: "/category/crypto" },
    { name: "Economy", href: "/category/economy" },
    { name: "Finance", href: "/category/finance" },
    { name: "Politics", href: "/category/politics" },
  ],
};

const socialLinks = [
  { name: "Twitter", href: "https://twitter.com", icon: Twitter },
  { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
  { name: "YouTube", href: "https://youtube.com", icon: Youtube },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-3 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                The Fiscal<span className="text-primary">Wire</span>
              </span>
            </Link>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground max-w-xs">
              Professional finance news delivering real-time market data, breaking news, and expert analysis.
            </p>
            {/* Social Links */}
            <div className="mt-4 sm:mt-6 flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors p-1 -m-1"
                >
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Sections Column */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-foreground uppercase tracking-wider">
              Sections
            </h3>
            <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
              {footerLinks.sections.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors py-0.5 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-foreground uppercase tracking-wider">
              Company
            </h3>
            <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors py-0.5 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-foreground uppercase tracking-wider">
              Legal
            </h3>
            <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors py-0.5 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-6 sm:my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-3 sm:gap-4 sm:flex-row">
          <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            &copy; {new Date().getFullYear()} The Fiscal Wire. All rights reserved.
          </p>
          <p className="text-[10px] sm:text-xs text-muted-foreground text-center sm:text-right">
            Market data provided for informational purposes only. Not investment advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
