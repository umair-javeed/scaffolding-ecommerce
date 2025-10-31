import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia' as any,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency, items, customerEmail, shippingAddress } = body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: currency || 'usd',
          product_data: {
            name: item.name,
            description: `${item.weight} ${item.unit}`,
          },
          unit_amount: Math.round(item.pricePerUnit * 100),
        },
        quantity: item.weight,
      })),
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/checkout/payment`,
      customer_email: customerEmail,
      metadata: {
        customerEmail,
        shippingAddress: JSON.stringify(shippingAddress),
        items: JSON.stringify(items),
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}