import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  MessageSquare, 
  Megaphone, 
  ClipboardList, 
  ArrowRight,
  Sparkles,
  Shield,
  Zap
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Invoice Generator",
    description: "Create professional invoices in seconds. Auto-calculate totals and generate PDF-ready documents.",
    link: "/invoice",
    color: "bg-forest",
  },
  {
    icon: MessageSquare,
    title: "Business Messages",
    description: "Generate payment reminders, follow-ups, and thank you messages with the right tone.",
    link: "/messages",
    color: "bg-forest",
  },
  {
    icon: Megaphone,
    title: "Marketing Captions",
    description: "Create engaging social media captions for Instagram, WhatsApp, and Facebook.",
    link: "/marketing",
    color: "bg-forest",
  },
  {
    icon: ClipboardList,
    title: "Registration Guide",
    description: "Step-by-step guidance for registering your business in Kenya.",
    link: "/registration",
    color: "bg-forest",
  },
];

const benefits = [
  {
    icon: Zap,
    title: "Save Time",
    description: "Automate repetitive tasks and focus on growing your business.",
  },
  {
    icon: Shield,
    title: "Professional Output",
    description: "Every document and message looks polished and trustworthy.",
  },
  {
    icon: Sparkles,
    title: "AI-Ready",
    description: "Built with future AI integrations in mind for smarter automation.",
  },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-forest-light to-background py-20 md:py-28">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center animate-slide-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-forest/10 px-4 py-2 text-sm font-medium text-forest">
              <Sparkles className="h-4 w-4" />
              <span>Smart Business Tools for SMEs</span>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Smart Business Communication for{" "}
              <span className="text-forest">Local SMEs</span>
            </h1>
            <p className="mb-10 text-lg text-muted-foreground md:text-xl">
              Automate invoices, business messages, and marketing captions. 
              Professional tools designed for Kenyan entrepreneurs.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="xl">
                <Link to="/invoice">
                  <FileText className="h-5 w-5" />
                  Generate Invoice
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/messages">
                  <MessageSquare className="h-5 w-5" />
                  Create Message
                </Link>
              </Button>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-forest/20 blur-3xl" />
          <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-forest/10 blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="mb-14 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Everything You Need to <span className="text-forest">Run Your Business</span>
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Powerful tools designed specifically for small and medium businesses in Kenya.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Link
                key={feature.title}
                to={feature.link}
                className="group card-elevated hover:border-forest/30 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-foreground group-hover:text-forest transition-colors">
                  {feature.title}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
                <div className="flex items-center text-sm font-medium text-forest">
                  <span>Get Started</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-light">
                  <benefit.icon className="h-7 w-7 text-forest" />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-foreground">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-forest">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-5 text-3xl font-bold text-primary-foreground md:text-4xl">
              Ready to Streamline Your Business?
            </h2>
            <p className="mb-8 text-primary-foreground/80">
              Join thousands of Kenyan SMEs using MtaaBiz AI to save time and look professional.
            </p>
            <Button asChild size="xl" className="bg-charcoal hover:bg-charcoal/90">
              <Link to="/invoice">
                Start Creating Now
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
