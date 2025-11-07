// src/app/api/orders/create/route.ts
// API route to create order after successful Stripe payment

import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia' as any,
});

// Initialize DynamoDB
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const dynamoDB = DynamoDBDocumentClient.from(client);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Retrieve the Stripe checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer_details'],
    });

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Create order ID
    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Prepare order data for DynamoDB
    const orderData = {
      orderId: orderId,
      userId: session.customer_details?.email || 'guest',
      customerEmail: session.customer_details?.email,
      customerName: session.customer_details?.name,
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent as string,
      amount: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency,
      status: 'paid',
      paymentStatus: session.payment_status,
      shippingAddress: session.customer_details?.address || {},
      items: session.line_items?.data || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save order to DynamoDB
    const params = {
      TableName: 'Orders',
      Item: orderData,
    };

    await dynamoDB.send(new PutCommand(params));

    console.log('✅ Order created successfully:', orderId);

    return NextResponse.json({
      success: true,
      orderId: orderId,
      order: orderData,
    });

  } catch (error: any) {
    console.error('❌ Error creating order:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create order',
        details: error.message 
      },
      { status: 500 }
    );
  }
}