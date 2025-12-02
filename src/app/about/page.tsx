import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Metadata } from "next";
import { TrendingUp, Shield, Zap, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | The Fiscal Wire",
  description: "Learn about The Fiscal Wire - Your trusted source for real-time market data, breaking financial news, and expert analysis.",
};

const values = [
  {
    icon: TrendingUp,
    title: "Accurate Reporting",
    description: "We are committed to delivering accurate, unbiased financial news and market analysis.",
  },
  {
    icon: Zap,
    title: "Real-Time Updates",
    description: "Stay ahead with instant market updates and breaking news as events unfold.",
  },
  {
    icon: Shield,
    title: "Trusted Information",
    description: "Our team verifies all information before publication to ensure reliability.",
  },
  {
    icon: Users,
    title: "Community First",
    description: "We serve investors, traders, and financial enthusiasts with the information they need.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main id="main-content" className="flex-1 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">About The Fiscal Wire</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your trusted source for real-time market data, breaking financial news, and expert analysis.
            </p>
          </div>

          {/* Mission Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              The Fiscal Wire was founded with a clear mission: to democratize access to financial information
              and empower individuals to make informed investment decisions. We believe that quality financial
              news and analysis should be accessible to everyone, not just Wall Street professionals.
            </p>
            <p className="text-muted-foreground">
              Our team of experienced financial journalists and market analysts work around the clock to bring
              you the most relevant and timely information about global markets, cryptocurrencies, economic
              trends, and technology developments that impact your financial future.
            </p>
          </section>

          {/* Values Grid */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="p-6 rounded-lg border border-border bg-card"
                >
                  <value.icon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* What We Cover */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">What We Cover</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">Markets:</strong> Comprehensive coverage of stock markets,
                indices, commodities, and forex with real-time data and expert analysis.
              </p>
              <p>
                <strong className="text-foreground">Cryptocurrency:</strong> In-depth reporting on Bitcoin,
                Ethereum, and the broader crypto ecosystem, including DeFi and blockchain technology.
              </p>
              <p>
                <strong className="text-foreground">Economy:</strong> Analysis of economic indicators, Federal
                Reserve policy, inflation trends, and their impact on your investments.
              </p>
              <p>
                <strong className="text-foreground">Technology:</strong> Coverage of tech companies, innovation,
                and how technology is reshaping the financial landscape.
              </p>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="p-6 rounded-lg bg-muted">
            <h2 className="text-lg font-semibold text-foreground mb-2">Disclaimer</h2>
            <p className="text-sm text-muted-foreground">
              The information provided on The Fiscal Wire is for informational purposes only and should not
              be considered as financial advice. We do not provide personalized investment recommendations.
              Always conduct your own research and consult with a qualified financial advisor before making
              investment decisions. Past performance is not indicative of future results.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
