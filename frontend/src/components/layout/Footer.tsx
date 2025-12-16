import { Leaf, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-forest">MtaaBiz AI</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Smart business communication tools for Kenyan SMEs. Automate invoices, messages, and marketing.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/invoice" className="text-sm text-muted-foreground hover:text-forest transition-colors">
                Invoice Generator
              </Link>
              <Link to="/messages" className="text-sm text-muted-foreground hover:text-forest transition-colors">
                Message Templates
              </Link>
              <Link to="/marketing" className="text-sm text-muted-foreground hover:text-forest transition-colors">
                Marketing Captions
              </Link>
              <Link to="/registration" className="text-sm text-muted-foreground hover:text-forest transition-colors">
                Business Registration
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-forest" />
                <span>Nairobi, Kenya</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-forest" />
                <span>hello@mtaabiz.co.ke</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} MtaaBiz AI. Built for Kenyan entrepreneurs.
          </p>
        </div>
      </div>
    </footer>
  );
}
