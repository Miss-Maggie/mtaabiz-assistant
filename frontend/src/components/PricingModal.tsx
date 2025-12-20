import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, CreditCard, ChevronRight, Smartphone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface PricingPlan {
    id: string;
    name: string;
    price: string;
    description: string;
    features: string[];
    color: string;
    popular?: boolean;
}

const plans: PricingPlan[] = [
    {
        id: "bronze",
        name: "Bronze (Basic)",
        price: "KES 500",
        description: "Perfect for starting out",
        color: "bg-orange-100 text-orange-700 border-orange-200",
        features: [
            "Unlimited Invoices",
            "50 Business Messages/mo",
            "Basic Marketing Captions",
            "Email Support"
        ],
    },
    {
        id: "silver",
        name: "Silver (Business)",
        price: "KES 1,500",
        description: "Ideal for growing businesses",
        color: "bg-slate-100 text-slate-700 border-slate-200",
        popular: true,
        features: [
            "Everything in Bronze",
            "Unlimited Messages",
            "AI Marketing Assistant",
            "Priority WhatsApp Support",
            "Customer Dashboard"
        ],
    },
    {
        id: "gold",
        name: "Gold (Enterprise)",
        price: "KES 3,500",
        description: "Full suite for pros",
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
        features: [
            "Everything in Silver",
            "Custom Branding",
            "Advanced AI Insights",
            "Dedicated Account Manager",
            "API Access"
        ],
    },
];

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpgradeTest: () => Promise<void>;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onUpgradeTest }) => {
    const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
    const { user } = useAuth();

    const handleBack = () => setSelectedPlan(null);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                        {selectedPlan ? "Complete Payment" : "Upgrade to MtaaBiz PRO"}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {selectedPlan
                            ? `Follow instructions to activate your ${selectedPlan.name} plan`
                            : "Choose the plan that fits your business needs"}
                    </DialogDescription>
                </DialogHeader>

                {!selectedPlan ? (
                    <div className="grid gap-6 md:grid-cols-3 mt-6">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`relative flex flex-col p-6 rounded-2xl border transition-all hover:shadow-lg ${plan.popular ? 'border-forest ring-1 ring-forest/20' : 'border-border'
                                    }`}
                            >
                                {plan.popular && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-forest text-white text-[10px] font-bold py-1 px-3 rounded-full">
                                        MOST POPULAR
                                    </span>
                                )}

                                <div className={`inline-flex w-fit px-3 py-1 rounded-full text-xs font-semibold mb-4 ${plan.color}`}>
                                    {plan.name}
                                </div>

                                <div className="mb-4">
                                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                                    <span className="text-muted-foreground text-sm">/month</span>
                                </div>

                                <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

                                <div className="space-y-3 mb-8 flex-1">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-2 text-sm">
                                            <Check className="h-4 w-4 text-forest mt-0.5 shrink-0" />
                                            <span className="text-foreground">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    className="w-full"
                                    variant={plan.popular ? "forest" : "outline"}
                                    onClick={() => setSelectedPlan(plan)}
                                >
                                    Choose Plan
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="mt-6 space-y-6">
                        <div className={`p-4 rounded-xl border flex items-center justify-between ${selectedPlan.color}`}>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider opacity-70">Selected Plan</p>
                                <p className="text-lg font-bold">{selectedPlan.name}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold">{selectedPlan.price}</p>
                                <p className="text-xs opacity-70">Per Month</p>
                            </div>
                        </div>

                        <div className="bg-muted/50 rounded-2xl p-6 border border-border">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                                    <Smartphone className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-bold">M-Pesa Payment Instructions</h3>
                            </div>

                            <ol className="space-y-4">
                                {[
                                    "Go to your M-Pesa Menu",
                                    "Select Lipa Na M-Pesa",
                                    "Select Paybill",
                                    <>Enter Business No: <span className="font-bold text-foreground">123456</span></>,
                                    <>Enter Account No: <span className="font-bold text-foreground">MB-{user?.username?.toUpperCase() || "USER"}</span></>,
                                    <>Enter Amount: <span className="font-bold text-foreground">{selectedPlan.price.replace('KES ', '')}</span></>,
                                    "Enter your M-Pesa PIN and Send"
                                ].map((step, i) => (
                                    <li key={i} className="flex gap-4 items-start">
                                        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-forest/10 text-forest text-xs font-bold shrink-0">
                                            {i + 1}
                                        </span>
                                        <span className="text-muted-foreground text-sm">{step}</span>
                                    </li>
                                ))}
                            </ol>

                            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-100 rounded-lg text-xs text-yellow-800">
                                <strong>Note:</strong> Once payment is complete, it usually takes 2-5 minutes for your account to be automatically upgraded. If you have any issues, contact support with your M-Pesa transaction code.
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button variant="ghost" onClick={handleBack} className="flex-1">
                                Back to Plans
                            </Button>
                            <Button
                                variant="forest"
                                onClick={() => {
                                    onUpgradeTest();
                                    onClose();
                                }}
                                className="flex-1"
                            >
                                Simulate Payment (Test)
                            </Button>
                        </div>
                    </div>
                )}

                <div className="mt-6 flex items-center justify-center gap-6 text-[10px] text-muted-foreground font-medium uppercase tracking-widest border-t pt-6">
                    <div className="flex items-center gap-1">
                        <CreditCard className="h-3 w-3" />
                        Secure Payment
                    </div>
                    <div className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        Instant Activation
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
