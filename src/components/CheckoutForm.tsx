import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from './ui/Button';
import { Loader2 } from 'lucide-react';

interface CheckoutFormProps {
    total: number;
    orderId: string;
    onSuccess: () => void;
}

export default function CheckoutForm({ total, orderId, onSuccess }: CheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);
        setErrorMessage(null);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/profile?order=${orderId}`,
            },
            redirect: 'if_required',
        });

        if (error) {
            setErrorMessage(error.message || 'An unexpected error occurred.');
            setIsProcessing(false);
        } else {
            // Payment succeeded locally without redirect
            onSuccess();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                <PaymentElement 
                    options={{
                        layout: 'tabs',
                    }} 
                />
            </div>

            {errorMessage && (
                <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm">
                    {errorMessage}
                </div>
            )}

            <Button 
                type="submit" 
                size="xl" 
                disabled={!stripe || isProcessing}
                className="w-full bg-body-accent text-white hover:text-black shadow-[0_0_20px_rgba(255,100,42,0.3)] transition-all duration-300 font-black uppercase tracking-widest"
            >
                {isProcessing ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                    </div>
                ) : (
                    `Pay AED ${total.toFixed(2)}`
                )}
            </Button>
        </form>
    );
}
