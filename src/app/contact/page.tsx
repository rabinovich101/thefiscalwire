import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Metadata } from "next";
import { Mail, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | The Fiscal Wire",
  description: "Get in touch with The Fiscal Wire team. We welcome your feedback, tips, and inquiries.",
};

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    description: "For general inquiries and feedback",
    value: "info@thefiscalwire.com",
  },
  {
    icon: MapPin,
    title: "Location",
    description: "We operate remotely",
    value: "United States",
  },
  {
    icon: Clock,
    title: "Response Time",
    description: "We aim to respond within",
    value: "24-48 hours",
  },
];

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main id="main-content" className="flex-1 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have a question, feedback, or a news tip? We&apos;d love to hear from you.
            </p>
          </div>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {contactInfo.map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-lg border border-border bg-card text-center"
              >
                <item.icon className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                <p className="text-foreground font-medium">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Contact Categories */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-6">How Can We Help?</h2>
            <div className="space-y-6">
              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="text-lg font-semibold text-foreground mb-2">General Inquiries</h3>
                <p className="text-muted-foreground mb-2">
                  For general questions about The Fiscal Wire, our content, or services.
                </p>
                <a href="mailto:info@thefiscalwire.com" className="text-primary hover:underline">
                  info@thefiscalwire.com
                </a>
              </div>

              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="text-lg font-semibold text-foreground mb-2">News Tips</h3>
                <p className="text-muted-foreground mb-2">
                  Have a news tip or story idea? We welcome tips from our readers.
                </p>
                <a href="mailto:tips@thefiscalwire.com" className="text-primary hover:underline">
                  tips@thefiscalwire.com
                </a>
              </div>

              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="text-lg font-semibold text-foreground mb-2">Advertising</h3>
                <p className="text-muted-foreground mb-2">
                  Interested in advertising opportunities? Reach out to our advertising team.
                </p>
                <a href="mailto:ads@thefiscalwire.com" className="text-primary hover:underline">
                  ads@thefiscalwire.com
                </a>
              </div>

              <div className="p-6 rounded-lg border border-border bg-card">
                <h3 className="text-lg font-semibold text-foreground mb-2">Technical Support</h3>
                <p className="text-muted-foreground mb-2">
                  Experiencing issues with our website? Let us know so we can help.
                </p>
                <a href="mailto:support@thefiscalwire.com" className="text-primary hover:underline">
                  support@thefiscalwire.com
                </a>
              </div>
            </div>
          </section>

          {/* Social Media */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Follow Us</h2>
            <p className="text-muted-foreground mb-4">
              Stay connected and get the latest updates by following us on social media.
            </p>
            <div className="flex gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors"
              >
                Twitter
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors"
              >
                YouTube
              </a>
            </div>
          </section>

          {/* Note */}
          <section className="p-6 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Please note:</strong> We receive a high volume of emails
              and may not be able to respond to every message. We prioritize news tips, technical issues,
              and business inquiries. For general questions, please check our FAQ or browse our articles
              for information.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
