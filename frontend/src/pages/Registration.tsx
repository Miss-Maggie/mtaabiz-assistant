import { Layout } from "@/components/layout/Layout";
import { 
  ClipboardList, 
  FileText, 
  Building2, 
  CreditCard, 
  CheckCircle2,
  ExternalLink,
  Sparkles
} from "lucide-react";

const steps = [
  {
    number: 1,
    icon: FileText,
    title: "Reserve Your Business Name",
    description: "Visit the eCitizen portal and search for your desired business name. If available, reserve it for 30 days.",
    details: [
      "Go to ecitizen.go.ke and create an account",
      "Navigate to Business Registration services",
      "Search to check if your name is available",
      "Pay KES 150 to reserve the name",
    ],
    link: "https://www.ecitizen.go.ke",
  },
  {
    number: 2,
    icon: Building2,
    title: "Register Your Business",
    description: "Choose your business type and complete the registration process online.",
    details: [
      "Sole Proprietorship - for individual owners",
      "Partnership - for 2+ people in business together",
      "Limited Company - for larger businesses",
      "Fill in required details and upload documents",
    ],
    fees: "KES 950 - 10,000 depending on type",
  },
  {
    number: 3,
    icon: CreditCard,
    title: "Get Your KRA PIN",
    description: "Register with Kenya Revenue Authority to get your tax PIN for your business.",
    details: [
      "Visit itax.kra.go.ke",
      "Apply for a business PIN",
      "Link it to your personal PIN",
      "Download your PIN certificate",
    ],
    link: "https://itax.kra.go.ke",
  },
  {
    number: 4,
    icon: FileText,
    title: "Apply for Business Permits",
    description: "Get the necessary permits from your county government to operate legally.",
    details: [
      "Single Business Permit from your county",
      "Health certificates if handling food",
      "Fire safety certificate if needed",
      "Display your permits at your business location",
    ],
    fees: "Varies by county and business type",
  },
  {
    number: 5,
    icon: CheckCircle2,
    title: "Open a Business Bank Account",
    description: "Set up a separate bank account for your business transactions.",
    details: [
      "Choose a bank with good SME services",
      "Bring your business registration certificate",
      "Bring your KRA PIN certificate",
      "Bring your ID and passport photos",
    ],
  },
];

export default function Registration() {
  return (
    <Layout>
      <div className="container py-10">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-forest-light px-4 py-2 text-sm font-medium text-forest mb-4">
            <ClipboardList className="h-4 w-4" />
            <span>Registration Guide</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl mb-3">
            Register Your Business in Kenya
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            A step-by-step guide to legally register your business. Follow these steps to get started.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6 max-w-3xl">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="card-elevated relative overflow-hidden animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex gap-5">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest text-primary-foreground font-bold text-lg">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <step.icon className="h-6 w-6 text-forest mt-0.5" />
                    <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">{step.description}</p>
                  
                  <ul className="space-y-2 mb-4">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-forest mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-3">
                    {step.fees && (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted text-sm font-medium text-muted-foreground">
                        <CreditCard className="h-3.5 w-3.5" />
                        {step.fees}
                      </span>
                    )}
                    {step.link && (
                      <a
                        href={step.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-forest-light text-sm font-medium text-forest hover:bg-forest hover:text-primary-foreground transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Visit Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Helpful Tips */}
        <div className="mt-10 max-w-3xl">
          <div className="card-elevated bg-forest-light border-forest/20">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest flex-shrink-0">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-forest mb-2">Pro Tips for Registration</h3>
                <ul className="space-y-2 text-sm text-forest/80">
                  <li>• Keep copies of all documents - both digital and physical</li>
                  <li>• Set calendar reminders for license renewals</li>
                  <li>• Join MSEA (Micro and Small Enterprises Authority) for support</li>
                  <li>• Consider hiring a lawyer for company registration</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* AI Note */}
        <div className="mt-6 max-w-3xl">
          <div className="p-5 rounded-xl bg-muted border border-border">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-forest mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">AI Assistant Coming Soon</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Future versions will include an AI chatbot to answer your specific questions about business registration in Kenya.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
