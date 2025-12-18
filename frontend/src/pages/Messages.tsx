import { useState } from "react";
import { api } from "@/lib/api";
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
import { MessageSquare, Copy, Check, Sparkles, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { shareToWhatsApp } from "@/lib/share";

const messageTemplates = {
  "payment-reminder": {
    polite: (name: string, amount: string) =>
      `Dear ${name},\n\nI hope this message finds you well. This is a gentle reminder regarding the outstanding payment of ${amount} for services rendered.\n\nKindly arrange for the payment at your earliest convenience. Please let me know if you have any questions.\n\nThank you for your continued partnership.\n\nBest regards`,
    friendly: (name: string, amount: string) =>
      `Hi ${name}! 👋\n\nJust a quick heads up - there's an outstanding balance of ${amount} on your account.\n\nNo rush, but if you could sort it out when you get a chance, that would be great! Let me know if anything's unclear.\n\nCheers!`,
  },
  "follow-up": {
    polite: (name: string, _amount: string) =>
      `Dear ${name},\n\nI wanted to follow up on our recent discussion and check if you had any questions or needed additional information.\n\nPlease don't hesitate to reach out if there's anything I can assist you with.\n\nLooking forward to hearing from you.\n\nBest regards`,
    friendly: (name: string, _amount: string) =>
      `Hey ${name}! 👋\n\nJust checking in to see how things are going! Wanted to follow up on our last chat.\n\nAny questions? I'm here to help!\n\nTalk soon!`,
  },
  "thank-you": {
    polite: (name: string, _amount: string) =>
      `Dear ${name},\n\nThank you for your recent business. We truly appreciate your trust in our services.\n\nWe look forward to serving you again and building a lasting partnership.\n\nWith gratitude,`,
    friendly: (name: string, _amount: string) =>
      `Hey ${name}! 🙏\n\nJust wanted to say a huge THANK YOU for your business! You're awesome!\n\nCan't wait to work with you again. You know where to find me!\n\nCheers!`,
  },
};

export default function Messages() {
  const [messageType, setMessageType] = useState<keyof typeof messageTemplates>("payment-reminder");
  const [tone, setTone] = useState<"polite" | "friendly">("polite");
  const [clientName, setClientName] = useState("");
  const [amount, setAmount] = useState("");
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!clientName) {
      toast({
        title: "Missing Information",
        description: "Please enter the client name.",
        variant: "destructive",
      });
      return;
    }

    const template = messageTemplates[messageType][tone];
    const message = template(clientName, amount || "the agreed amount");
    setGeneratedMessage(message);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Message copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const [savedMessages, setSavedMessages] = useState<any[]>([]);
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = async () => {
    if (!generatedMessage) return;

    try {
      await api.createMessage({
        title: `${messageType} for ${clientName}`,
        content: generatedMessage,
        category: messageType === "payment-reminder" ? "REMINDER" : messageType === "follow-up" ? "FOLLOWUP" : "MARKETING"
      });
      toast({
        title: "Saved!",
        description: "Message template saved to your library.",
      });
      loadSavedMessages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save message template.",
        variant: "destructive",
      });
    }
  };

  const loadSavedMessages = async () => {
    try {
      const msgs = await api.getMessages();
      setSavedMessages(msgs);
      setShowSaved(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="container py-10">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-forest-light px-4 py-2 text-sm font-medium text-forest mb-4">
            <MessageSquare className="h-4 w-4" />
            <span>Business Messages</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl mb-3">
            Generate Business Messages
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Create professional messages for payment reminders, follow-ups, and thank you notes.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form Section */}
          <div className="card-elevated">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-foreground">Message Settings</h2>
              <Button variant="ghost" size="sm" onClick={loadSavedMessages}>
                View Saved Library
              </Button>
            </div>

            <div className="space-y-5">
              <div>
                <Label htmlFor="messageType" className="text-foreground">Message Type</Label>
                <Select
                  value={messageType}
                  onValueChange={(value) => setMessageType(value as keyof typeof messageTemplates)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select message type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="payment-reminder">Payment Reminder</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="thank-you">Thank You</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tone" className="text-foreground">Tone</Label>
                <Select value={tone} onValueChange={(value) => setTone(value as "polite" | "friendly")}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="polite">Polite & Professional</SelectItem>
                    <SelectItem value="friendly">Friendly & Casual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="clientName" className="text-foreground">Client Name</Label>
                <Input
                  id="clientName"
                  placeholder="e.g., John"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="mt-2"
                />
              </div>

              {messageType === "payment-reminder" && (
                <div>
                  <Label htmlFor="amount" className="text-foreground">Amount (optional)</Label>
                  <Input
                    id="amount"
                    placeholder="e.g., KES 5,000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-2"
                  />
                </div>
              )}

              <Button onClick={handleGenerate} size="lg" className="w-full" variant="forest">
                <Sparkles className="h-5 w-5" />
                Generate Message
              </Button>
            </div>
          </div>

          {/* Output Section */}
          <div className="card-elevated lg:sticky lg:top-24 h-fit">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-foreground">
                {showSaved ? "Saved Templates" : "Generated Message"}
              </h2>
              {generatedMessage && !showSaved && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSave}
                    className="text-forest hover:text-forest-dark"
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareToWhatsApp(generatedMessage)}
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

            {showSaved ? (
              <div className="space-y-4">
                {savedMessages.length === 0 ? (
                  <p className="text-muted-foreground text-center py-10">No saved messages yet.</p>
                ) : (
                  savedMessages.map((msg: any) => (
                    <div key={msg.id} className="p-4 rounded-lg bg-muted/50 border border-border">
                      <h3 className="font-semibold text-sm mb-2">{msg.title}</h3>
                      <p className="text-sm text-foreground mb-3 line-clamp-3">{msg.content}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setGeneratedMessage(msg.content);
                          setShowSaved(false);
                        }}
                      >
                        Use Template
                      </Button>
                    </div>
                  ))
                )}
                <Button variant="ghost" className="w-full" onClick={() => setShowSaved(false)}>
                  Back to Generator
                </Button>
              </div>
            ) : generatedMessage ? (
              <div className="bg-muted/50 rounded-lg border border-border p-5">
                <pre className="whitespace-pre-wrap text-sm text-foreground font-sans leading-relaxed">
                  {generatedMessage}
                </pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
                  <MessageSquare className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  Configure your message settings and click "Generate Message"
                </p>
              </div>
            )}

            {/* AI Note */}
            <div className="mt-6 p-4 rounded-lg bg-forest-light border border-forest/20">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-forest mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-forest">AI Integration Coming Soon</p>
                  <p className="text-xs text-forest/70 mt-1">
                    Future versions will use OpenAI/Vertex AI for even smarter, context-aware messages.
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
