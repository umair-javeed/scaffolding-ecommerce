import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia' as any, // FIXED: Changed from 2025-01-27.acacia
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customerEmail, shippingAddress } = body;

    console.log('🔵 Creating Stripe session for:', customerEmail);

    // FIXED: Remove image URLs from items to reduce metadata size
    const simplifiedItems = items.map((item: any) => ({
      id: item.id,
      name: item.name,
      weight: item.weight,
      unit: item.unit,
      pricePerUnit: item.pricePerUnit,
      // image removed - not needed in metadata
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => {
        // FIXED: Calculate total price (weight × price per unit)
        const totalItemPrice = item.weight * item.pricePerUnit;
        
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
              description: `${item.weight} ${item.unit} @ $${item.pricePerUnit.toFixed(2)}/${item.unit}`,
            },
            // FIXED: Use total price instead of unit price
            unit_amount: Math.round(totalItemPrice * 100),
          },
          // FIXED: Always use quantity 1 (price already includes weight calculation)
          quantity: 1,
        };
      }),
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/checkout/payment`,
      customer_email: customerEmail,
      metadata: {
        customerEmail,
        shippingAddress: JSON.stringify(shippingAddress),
        items: JSON.stringify(simplifiedItems), // FIXED: Use simplified items without images
        itemCount: items.length.toString(),
        orderDate: new Date().toISOString(),
      },
    });

    console.log('✅ Stripe session created:', session.id);

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('❌ Stripe error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}