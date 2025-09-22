import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'usd' } = await request.json();

    // Validate amount
    if (!amount || amount <= 0 || amount > 999999) {
      return NextResponse.json(
        { error: 'Invalid amount. Must be between $0.01 and $9,999.99' },
        { status: 400 }
      );
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        source: 'ai-sales-agent',
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error: any) {
    console.error('Stripe payment intent creation failed:', error);
    
    return NextResponse.json(
      { 
        error: 'Payment processing error',
        message: error?.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}