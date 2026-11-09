import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

type DemoTier = 500 | 100;

const inputCls =
    'w-full bg-black/30 border border-body-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-body-accent';

function DemoPaymentForm({ onSuccess, amountLabel, returnPath }: { onSuccess: () => void; amountLabel: string; returnPath: string }) {
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
            confirmParams: { return_url: `${window.location.origin}${returnPath}?status=complete` },
            redirect: 'if_required',
        });

        if (error) {
            setErrorMessage(error.message || 'An unexpected error occurred.');
            setIsProcessing(false);
        } else {
            onSuccess();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                <PaymentElement options={{ layout: 'tabs' }} />
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
                    `Pay ${amountLabel}`
                )}
            </Button>
        </form>
    );
}

export default function DemoPayment({ tier = 500 }: { tier?: DemoTier }) {
    const AMOUNT_LABEL = `USD ${tier.toFixed(2)}`;
    const returnPath = tier === 500 ? '/demo-payment' : `/demo-payment-${tier}`;
    const returnedComplete = new URLSearchParams(window.location.search).get('status') === 'complete';

    const [email, setEmail] = useState('');
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(returnedComplete);

    const startPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supabase) {
            setError('Payments are temporarily unavailable.');
            return;
        }
        setIsLoading(true);
        setError(null);

        const { data, error: funcErr } = await supabase.functions.invoke('create-demo-payment', {
            body: { email: email.trim() || undefined, tier: String(tier) },
        });

        if (funcErr || !data?.clientSecret) {
            setError(data?.error || funcErr?.message || 'Could not start the payment. Please try again.');
        } else {
            setClientSecret(data.clientSecret);
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen pt-28 pb-20 px-4">
            <div className="max-w-xl mx-auto">
                <p className="text-body-accent text-xs font-black uppercase tracking-[0.3em] mb-3">Demo Payment</p>
                <h1 className="text-white text-4xl md:text-5xl font-black uppercase tracking-tight mb-2">
                    {AMOUNT_LABEL}
                </h1>
                <p className="text-gray-400 text-sm mb-8">
                    Secure card payment processed by Stripe. Your card will be charged {AMOUNT_LABEL}.
                </p>

                <div className="bg-body-card border border-body-border rounded-2xl p-6">
                    {isSuccess ? (
                        <div className="flex flex-col items-center text-center gap-3 py-8">
                            <CheckCircle2 className="w-14 h-14 text-green-400" />
                            <h2 className="text-white text-2xl font-black">Payment received</h2>
                            <p className="text-gray-400 text-sm">Thank you. Your payment of {AMOUNT_LABEL} was successful.</p>
                        </div>
                    ) : clientSecret ? (
                        <Elements
                            stripe={stripePromise}
                            options={{
                                clientSecret,
                                appearance: {
                                    theme: 'night',
                                    variables: {
                                        colorPrimary: '#F55A1A',
                                        colorBackground: '#1A100A',
                                        colorText: '#ffffff',
                                        colorDanger: '#ef4444',
                                        fontFamily: 'Inter, sans-serif',
                                        borderRadius: '10px',
                                    },
                                },
                            }}
                        >
                            <DemoPaymentForm onSuccess={() => setIsSuccess(true)} amountLabel={AMOUNT_LABEL} returnPath={returnPath} />
                        </Elements>
                    ) : (
                        <form onSubmit={startPayment} className="flex flex-col gap-4">
                            <label className="text-gray-300 text-sm font-semibold" htmlFor="demo-email">
                                Email for receipt (optional)
                            </label>
                            <input
                                id="demo-email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={inputCls}
                            />

                            {error && (
                                <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                size="xl"
                                disabled={isLoading}
                                className="w-full bg-body-accent text-white hover:text-black font-black uppercase tracking-widest"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Loading...
                                    </div>
                                ) : (
                                    'Continue to payment'
                                )}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
