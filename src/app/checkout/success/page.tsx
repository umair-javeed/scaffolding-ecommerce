'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createOrder } from '@/lib/api';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      router.push('/');
      return;
    }

    createOrderAfterPayment(sessionId);
  }, [searchParams, router]);

  const createOrderAfterPayment = async (sessionId: string) => {
    try {
      // Get cart and checkout data
      const savedCart = localStorage.getItem('cart');
      const savedCheckout = localStorage.getItem('checkoutData');

      if (!savedCart || !savedCheckout) {
        throw new Error('Order data not found');
      }

      const cartItems = JSON.parse(savedCart);
      const checkoutData = JSON.parse(savedCheckout);

      const totalAmount = cartItems.reduce((sum: number, item: any) => {
        return sum + (item.weight * item.pricePerUnit);
      }, 0);

      // Create order with payment info
      const order = {
        customerEmail: checkoutData.email,
        items: cartItems.map((item: any) => ({
          id: item.id,
          name: item.name,
          weight: item.weight,
          unit: item.unit,
          pricePerUnit: item.pricePerUnit
        })),
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        shippingAddress: checkoutData.shippingAddress,
        paymentInfo: {
          stripeSessionId: sessionId,
          paymentStatus: 'paid',
          paymentMethod: 'card',
          paidAt: Date.now()
        }
      };

      const response = await createOrder(order);

      if (response.success) {
        setOrderId(response.orderId);
        // Clear cart and checkout data
        localStorage.removeItem('cart');
        localStorage.removeItem('checkoutData');
      } else {
        setError('Failed to create order');
      }
    } catch (err: any) {
      console.error('Error creating order:', err);
      setError(err.message || 'Error creating order');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold">Processing your order...</h2>
          <p className="text-gray-600 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-4">Order Error</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Link
            href="/"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition font-semibold inline-block"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-2xl text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            Payment Successful!
          </h1>
          <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
          <p className="text-xl mb-2">Order ID: <strong>{orderId}</strong></p>
          <p className="text-gray-600 mb-6">
            You will receive a confirmation email shortly.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-semibold">
              ✅ Payment processed successfully
            </p>
            <p className="text-green-700 text-sm mt-1">
              Your order is being prepared for shipment
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/orders"
              className="block w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
            >
              View Your Orders
            </Link>
            <Link
              href="/"
              className="block w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}