import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia' as any,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      id: session.id,
      customer_email: session.customer_email,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
      metadata: session.metadata
    });
  } catch (error: any) {
    console.error('Error retrieving Stripe session:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}