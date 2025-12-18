import { useState, useRef, useEffect } from "react";
import { api, Invoice as InvoiceType } from "@/lib/api";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Plus, Trash2, Download, Sparkles, Loader2, Share2, History } from "lucide-react";
import { jsPDF } from "jspdf";
import { useToast } from "@/hooks/use-toast";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function Invoice() {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [items, setItems] = useState<LineItem[]>([
    { id: "1", description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [savedInvoices, setSavedInvoices] = useState<InvoiceType[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const invoiceNumber = useRef(`INV-${Date.now().toString().slice(-6)}`);
  const { toast } = useToast();

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const data = await api.getInvoices();
      setSavedInvoices(data);
    } catch (error) {
      console.error("Failed to load invoices", error);
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), description: "", quantity: 1, unitPrice: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(amount);
  };

  const handleGenerate = () => {
    setShowPreview(true);
  };

  // Helper to generate PDF object (reused for download and share)
  const generatePDFBlob = (): Blob => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = 20;

    // Header - Company branding
    doc.setFillColor(45, 90, 61); // Forest green
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", margin, 28);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("MtaaBiz AI", pageWidth - margin, 20, { align: "right" });
    doc.text("Nairobi, Kenya", pageWidth - margin, 26, { align: "right" });
    doc.text("hello@mtaabiz.co.ke", pageWidth - margin, 32, { align: "right" });

    yPos = 55;

    // Invoice details
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.text(`Invoice Number: ${invoiceNumber.current}`, margin, yPos);
    doc.text(`Date: ${new Date().toLocaleDateString("en-KE")}`, margin, yPos + 6);
    doc.text("Due Date: 30 days from issue", margin, yPos + 12);

    yPos += 30;

    // Bill To section
    doc.setTextColor(45, 90, 61);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO", margin, yPos);

    yPos += 8;
    doc.setTextColor(50, 50, 50);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(clientName, margin, yPos);
    if (clientEmail) {
      yPos += 6;
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(clientEmail, margin, yPos);
    }
    if (clientPhone) {
      yPos += 6;
      doc.text(clientPhone, margin, yPos);
    }

    yPos += 20;

    // Table header
    doc.setFillColor(245, 247, 245);
    doc.rect(margin, yPos - 5, pageWidth - margin * 2, 10, 'F');

    doc.setTextColor(45, 90, 61);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    // Adjusted coordinates to fix overlapping
    // Adjusted coordinates to fix overlapping - Right aligning numbers
    doc.text("Description", margin + 2, yPos);
    doc.text("Qty", 125, yPos, { align: "right" });
    doc.text("Price", 155, yPos, { align: "right" });
    doc.text("Total", 190, yPos, { align: "right" });

    yPos += 10;

    // Table rows
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);

    const validItems = items.filter((item) => item.description);
    validItems.forEach((item) => {
      doc.text(item.description.substring(0, 40), margin + 2, yPos);
      doc.text(item.quantity.toString(), 125, yPos, { align: "right" });
      doc.text(formatCurrency(item.unitPrice), 155, yPos, { align: "right" });
      doc.text(formatCurrency(item.quantity * item.unitPrice), 190, yPos, { align: "right" });

      // Draw line
      doc.setDrawColor(230, 230, 230);
      doc.line(margin, yPos + 3, pageWidth - margin, yPos + 3);

      yPos += 10;
    });

    yPos += 10;

    // Total
    doc.setFillColor(45, 90, 61);
    doc.rect(130, yPos - 5, pageWidth - margin - 130, 12, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL DUE:", 135, yPos + 2);
    doc.text(formatCurrency(calculateTotal()), 190, yPos + 2, { align: "right" });

    yPos += 30;

    // Notes Section (New)
    if (notes) {
      doc.setTextColor(45, 90, 61);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("NOTES / TERMS", margin, yPos);
      yPos += 7;

      doc.setTextColor(50, 50, 50);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      // Split text to fit page width
      const splitNotes = doc.splitTextToSize(notes, pageWidth - margin * 2);
      doc.text(splitNotes, margin, yPos);
      yPos += (splitNotes.length * 5) + 20;
    } else {
      yPos += 20;
    }

    // Footer
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Payment Terms: Due within 30 days of issue", margin, yPos);
    doc.text("Thank you for your business!", margin, yPos + 6);

    doc.setFontSize(8);
    doc.text("Generated by MtaaBiz AI • www.mtaabiz.co.ke", pageWidth / 2, 285, { align: "center" });

    return doc.output('blob');
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);

    try {
      // 1. Save to Backend
      const totalAmount = calculateTotal();
      await api.createInvoice({
        client_name: clientName,
        amount: totalAmount,
        date_issued: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'PENDING'
      });

      toast({
        title: "Saved to Dashboard",
        description: "Invoice has been saved to your account.",
      });

      // Refresh list
      loadInvoices();

      // 2. Generate PDF using jsPDF
      const blob = generatePDFBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${invoiceNumber.current}-${clientName.replace(/\s+/g, '-')}.pdf`;
      link.click();
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error("PDF generation/save error:", error);
      toast({
        title: "Error",
        description: "Failed to save invoice or generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const blob = generatePDFBlob();
        const file = new File([blob], `Invoice-${invoiceNumber.current}.pdf`, { type: 'application/pdf' });

        await navigator.share({
          title: 'Invoice from MtaaBiz',
          text: `Here is invoice ${invoiceNumber.current} for ${clientName}.`,
          files: [file]
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      toast({
        title: "Share not supported",
        description: "Your browser does not support direct sharing. Please download and send manually.",
        variant: "destructive"
      });
    }
  };

  return (
    <Layout>
      <div className="container py-10">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-forest-light px-4 py-2 text-sm font-medium text-forest mb-4">
            <FileText className="h-4 w-4" />
            <span>Invoice Generator</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl mb-3">
            Create Professional Invoices
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Fill in the details below to generate a professional invoice for your clients.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form Section */}
          <div className="space-y-6">
            <div className="card-elevated">
              <h2 className="text-lg font-semibold text-foreground mb-5">Client Details</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="clientName" className="text-foreground">Client Name</Label>
                  <Input
                    id="clientName"
                    placeholder="e.g., John Kamau"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clientEmail" className="text-foreground">Client Email</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      placeholder="john@example.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientPhone" className="text-foreground">Client Phone</Label>
                    <Input
                      id="clientPhone"
                      placeholder="0712 345 678"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card-elevated">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-foreground">Line Items</h2>
                <Button variant="outline" size="sm" onClick={addItem}>
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id} className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-muted-foreground">
                        Item {index + 1}
                      </span>
                      {items.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Input
                        placeholder="Description (e.g. Installation, Supply of materials)"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, "description", e.target.value)
                        }
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs text-muted-foreground">Quantity</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(item.id, "quantity", parseInt(e.target.value) || 0)
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Unit Price (KES)</Label>
                          <Input
                            type="number"
                            min="0"
                            value={item.unitPrice}
                            onChange={(e) =>
                              updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-border">
                <div className="flex items-center justify-between text-lg">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-bold text-forest text-xl">
                    {formatCurrency(calculateTotal())}
                  </span>
                </div>
              </div>
            </div>

            <div className="card-elevated">
              <h2 className="text-lg font-semibold text-foreground mb-3">Additional Notes</h2>
              <Textarea
                placeholder="Enter payment terms, installation details, or other notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <Button onClick={handleGenerate} size="lg" className="w-full" variant="forest">
              <Sparkles className="h-5 w-5" />
              Generate Invoice
            </Button>
          </div>

          {/* Preview Section */}
          <div className="flex flex-col gap-6">
            <div className="card-elevated lg:sticky lg:top-24 h-fit">
              <h2 className="text-lg font-semibold text-foreground mb-5">Invoice Preview</h2>

              {showPreview && clientName && items.some(i => i.description) ? (
                <div className="bg-background rounded-lg border border-border p-6">
                  <div className="border-b border-border pb-5 mb-5">
                    <h3 className="text-2xl font-bold text-forest mb-1">INVOICE</h3>
                    <p className="text-sm text-muted-foreground">
                      Date: {new Date().toLocaleDateString("en-KE")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Invoice #: {invoiceNumber.current}
                    </p>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-1">Bill To:</p>
                    <p className="font-semibold text-foreground">{clientName}</p>
                    {clientEmail && (
                      <p className="text-sm text-muted-foreground">{clientEmail}</p>
                    )}
                    {clientPhone && (
                      <p className="text-sm text-muted-foreground">{clientPhone}</p>
                    )}
                  </div>

                  <div className="mb-6 overflow-x-auto w-full">
                    <table className="w-full text-sm min-w-[600px]">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="py-2 text-left font-semibold text-foreground whitespace-nowrap">Description</th>
                          <th className="py-2 text-right font-semibold text-foreground px-2">Qty</th>
                          <th className="py-2 text-right font-semibold text-foreground px-2">Price</th>
                          <th className="py-2 text-right font-semibold text-foreground">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items
                          .filter((item) => item.description)
                          .map((item) => (
                            <tr key={item.id} className="border-b border-border/50">
                              <td className="py-3 text-foreground min-w-[120px]">{item.description}</td>
                              <td className="py-3 text-right text-muted-foreground px-2">{item.quantity}</td>
                              <td className="py-3 text-right text-muted-foreground px-2 whitespace-nowrap">
                                {formatCurrency(item.unitPrice)}
                              </td>
                              <td className="py-3 text-right font-medium text-foreground whitespace-nowrap">
                                {formatCurrency(item.quantity * item.unitPrice)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t-2 border-forest">
                    <span className="text-lg font-bold text-foreground">Total Due</span>
                    <span className="text-2xl font-bold text-forest whitespace-nowrap">
                      {formatCurrency(calculateTotal())}
                    </span>
                  </div>

                  {notes && (
                    <div className="mt-6 pt-5 border-t border-border">
                      <p className="text-sm font-semibold mb-1">Notes:</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">{notes}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                    <Button
                      variant="forest"
                      className="w-full"
                      size="lg"
                      onClick={handleDownloadPDF}
                      disabled={isDownloading}
                    >
                      {isDownloading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4 mr-2" />
                      )}
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      size="lg"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    Fill in the form and click "Generate Invoice" to see a preview
                  </p>
                </div>
              )}
            </div>

            {/* Dashboard / History Section */}
            <div className="card-elevated">
              <div className="flex items-center gap-2 mb-4">
                <History className="h-5 w-5 text-forest" />
                <h2 className="text-lg font-semibold text-foreground">Recent Invoices</h2>
              </div>

              {savedInvoices.length === 0 ? (
                <p className="text-sm text-muted-foreground">No saved invoices found.</p>
              ) : (
                <div className="space-y-3">
                  {savedInvoices.slice(0, 5).map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <div className="min-w-0 pr-4">
                        <p className="font-medium text-sm truncate">{inv.client_name}</p>
                        <p className="text-xs text-muted-foreground">{inv.date_issued}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-sm text-forest whitespace-nowrap">{formatCurrency(inv.amount)}</p>
                        <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full inline-block mt-1">{inv.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
