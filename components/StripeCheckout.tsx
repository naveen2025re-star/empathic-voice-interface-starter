"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

// Initialize Stripe - using dummy key for now until secrets are provided
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_dummy");

interface CheckoutFormProps {
  clientSecret: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

function CheckoutForm({ clientSecret, onSuccess, onError }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    });

    if (error) {
      onError(error.message || "Payment failed");
    } else {
      onSuccess();
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || loading}
        className="w-full"
      >
        {loading ? "Processing..." : "Complete Purchase"}
      </Button>
    </form>
  );
}

interface StripeCheckoutProps {
  amount: number;
  title?: string;
  description?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function StripeCheckout({ 
  amount, 
  title = "Complete Your Purchase",
  description = "Secure payment powered by Stripe",
  onSuccess,
  onCancel 
}: StripeCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const createPaymentIntent = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });
      
      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      toast.error("Failed to initialize payment");
      console.error("Payment init error:", error);
    }
    setLoading(false);
  };

  const handleSuccess = () => {
    toast.success("Payment successful! 🎉");
    onSuccess?.();
  };

  const handleError = (error: string) => {
    toast.error(`Payment failed: ${error}`);
  };

  if (!clientSecret) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={createPaymentIntent} 
            disabled={loading}
            className="w-full"
          >
            {loading ? "Initializing..." : `Pay $${amount}`}
          </Button>
          {onCancel && (
            <Button 
              variant="outline" 
              onClick={onCancel}
              className="w-full mt-2"
            >
              Cancel
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm 
            clientSecret={clientSecret}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </Elements>
        {onCancel && (
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="w-full mt-4"
          >
            Cancel
          </Button>
        )}
      </CardContent>
    </Card>
  );
}