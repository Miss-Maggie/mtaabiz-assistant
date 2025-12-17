import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Megaphone, Copy, Check, Sparkles, Instagram, MessageCircle, Facebook, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { shareToWhatsApp } from "@/lib/share";

const captionTemplates = {
  instagram: {
    food: (product: string, business: string) =>
      `🍽️ Craving something delicious? ${business} has got you covered!\n\nTry our amazing ${product} - made with love and the freshest ingredients! 🌟\n\nOrder now and taste the difference!\n\n📍 Available for delivery\n🕐 Open daily\n\n#KenyanFood #NairobiEats #FoodieKE #${business.replace(/\s/g, "")} #LocalBusiness`,
    retail: (product: string, business: string) =>
      `✨ New arrival alert! ✨\n\nCheck out our ${product} at ${business}! Perfect for the modern you. 💫\n\nLimited stock available - don't miss out!\n\n💰 Affordable prices\n🚚 Delivery available\n\nDM to order! 📩\n\n#ShopLocal #KenyanBusiness #${business.replace(/\s/g, "")} #NairobiShopping`,
    services: (product: string, business: string) =>
      `Looking for ${product}? Look no further! 🙌\n\n${business} offers professional, reliable services that you can trust.\n\n✅ Quality guaranteed\n✅ Affordable rates\n✅ Customer satisfaction first\n\nBook your appointment today!\n\n#KenyanServices #${business.replace(/\s/g, "")} #ProfessionalServices`,
  },
  whatsapp: {
    food: (product: string, business: string) =>
      `🍽️ *${business}*\n\nHungry? We've got the best ${product} in town!\n\n✅ Fresh ingredients\n✅ Fast delivery\n✅ Great prices\n\nOrder now via WhatsApp!\n\n📞 Call/Text to order`,
    retail: (product: string, business: string) =>
      `🛍️ *${business}*\n\n${product} now available!\n\n💰 Best prices guaranteed\n🚚 Delivery to your doorstep\n💳 M-Pesa accepted\n\nMessage us to order!`,
    services: (product: string, business: string) =>
      `👋 *${business}*\n\nNeed ${product}?\n\nWe offer:\n✅ Professional service\n✅ Fair pricing\n✅ Reliable scheduling\n\nContact us today to book!`,
  },
  facebook: {
    food: (product: string, business: string) =>
      `😋 Who else loves good food?\n\n${business} is serving up the most delicious ${product} you'll ever taste!\n\nWhy choose us?\n🌟 Made fresh daily\n🌟 Quality ingredients\n🌟 Affordable prices\n🌟 Fast delivery\n\nTag someone who needs to try this! 👇\n\nOrder now - Link in bio!`,
    retail: (product: string, business: string) =>
      `🛒 SHOP LOCAL, SUPPORT LOCAL! 🇰🇪\n\n${business} brings you amazing ${product} at prices you'll love!\n\nWhy shop with us?\n✨ Quality products\n✨ Great customer service\n✨ Fast delivery\n✨ M-Pesa payment\n\nShare with friends who'd love this! 💕`,
    services: (product: string, business: string) =>
      `Need reliable ${product}? We've got you! 💪\n\n${business} is here to help with all your needs.\n\nOur promise:\n🤝 Professional service\n⏰ Punctual delivery\n💯 Satisfaction guaranteed\n\nMessage us or call today!`,
  },
};

const platformIcons = {
  instagram: Instagram,
  whatsapp: MessageCircle,
  facebook: Facebook,
};

export default function Marketing() {
  const [platform, setPlatform] = useState<"instagram" | "whatsapp" | "facebook">("instagram");
  const [businessType, setBusinessType] = useState<"food" | "retail" | "services">("food");
  const [businessName, setBusinessName] = useState("");
  const [product, setProduct] = useState("");
  const [generatedCaption, setGeneratedCaption] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!businessName || !product) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const template = captionTemplates[platform][businessType];
    const caption = template(product, businessName);
    setGeneratedCaption(caption);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedCaption);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Caption copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const PlatformIcon = platformIcons[platform];

  return (
    <Layout>
      <div className="container py-10">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-forest-light px-4 py-2 text-sm font-medium text-forest mb-4">
            <Megaphone className="h-4 w-4" />
            <span>Marketing Captions</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl mb-3">
            Create Social Media Captions
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Generate engaging captions for Instagram, WhatsApp, and Facebook to promote your business.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form Section */}
          <div className="card-elevated">
            <h2 className="text-lg font-semibold text-foreground mb-5">Caption Settings</h2>
            
            <div className="space-y-5">
              <div>
                <Label htmlFor="platform" className="text-foreground">Platform</Label>
                <Select
                  value={platform}
                  onValueChange={(value) => setPlatform(value as typeof platform)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="instagram">
                      <span className="flex items-center gap-2">
                        <Instagram className="h-4 w-4" />
                        Instagram
                      </span>
                    </SelectItem>
                    <SelectItem value="whatsapp">
                      <span className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp Status
                      </span>
                    </SelectItem>
                    <SelectItem value="facebook">
                      <span className="flex items-center gap-2">
                        <Facebook className="h-4 w-4" />
                        Facebook
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="businessType" className="text-foreground">Business Type</Label>
                <Select
                  value={businessType}
                  onValueChange={(value) => setBusinessType(value as typeof businessType)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="food">Food & Beverage</SelectItem>
                    <SelectItem value="retail">Retail & Products</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="businessName" className="text-foreground">Business Name</Label>
                <Input
                  id="businessName"
                  placeholder="e.g., Mama's Kitchen"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="product" className="text-foreground">Product/Service</Label>
                <Input
                  id="product"
                  placeholder="e.g., Nyama Choma, Fashion accessories, Plumbing"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="mt-2"
                />
              </div>

              <Button onClick={handleGenerate} size="lg" className="w-full" variant="forest">
                <Sparkles className="h-5 w-5" />
                Generate Caption
              </Button>
            </div>
          </div>

          {/* Output Section */}
          <div className="card-elevated lg:sticky lg:top-24 h-fit">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground">Generated Caption</h2>
                {generatedCaption && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                    <PlatformIcon className="h-3 w-3" />
                    {platform}
                  </div>
                )}
              </div>
              {generatedCaption && (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => shareToWhatsApp(generatedCaption)}
                    className="text-green-600 border-green-600 hover:bg-green-50"
                  >
                    <Share2 className="h-4 w-4" />
                    WhatsApp
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              )}
            </div>

            {generatedCaption ? (
              <div className="bg-muted/50 rounded-lg border border-border p-5">
                <pre className="whitespace-pre-wrap text-sm text-foreground font-sans leading-relaxed">
                  {generatedCaption}
                </pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
                  <Megaphone className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  Fill in your business details to generate a caption
                </p>
              </div>
            )}

            {/* AI Note */}
            <div className="mt-6 p-4 rounded-lg bg-forest-light border border-forest/20">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-forest mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-forest">AI Enhancement Coming Soon</p>
                  <p className="text-xs text-forest/70 mt-1">
                    Future versions will generate unique, trending captions using AI.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
