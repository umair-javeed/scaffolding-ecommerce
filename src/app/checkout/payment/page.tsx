'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: number;
  name: string;
  weight: number;
  unit: 'kg' | 'lb';
  pricePerUnit: number;
  image: string;
}

interface CheckoutData {
  email: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export default function PaymentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedCheckout = localStorage.getItem('checkoutData');
    
    if (!savedCart || !savedCheckout) {
      router.push('/checkout');
      return;
    }

    setCartItems(JSON.parse(savedCart));
    setCheckoutData(JSON.parse(savedCheckout));
  }, [router]);

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      return sum + (item.weight * item.pricePerUnit);
    }, 0);
  };

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      const totalAmount = calculateTotal();

      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(totalAmount * 100),
          currency: 'usd',
          items: cartItems,
          customerEmail: checkoutData?.email,
          shippingAddress: checkoutData?.shippingAddress
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      // Load Stripe and redirect
      const stripePromise = (await import('@stripe/stripe-js')).loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );
      
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (result.error) {
        setError(result.error.message || 'Payment failed');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Error processing payment');
    } finally {
      setLoading(false);
    }
  };

  if (!checkoutData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Payment</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          
          {cartItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-3 pb-3 border-b">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">
                  {item.weight} {item.unit} × ${item.pricePerUnit.toFixed(2)}/{item.unit}
                </p>
              </div>
              <p className="font-bold text-primary-600">
                ${(item.weight * item.pricePerUnit).toFixed(2)}
              </p>
            </div>
          ))}

          <div className="flex justify-between items-center pt-4 text-xl font-bold">
            <span>Total:</span>
            <span className="text-primary-600">${calculateTotal().toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <p className="text-gray-700">{checkoutData.email}</p>
          <p className="text-gray-700 mt-2">
            {checkoutData.shippingAddress.street}<br />
            {checkoutData.shippingAddress.city}, {checkoutData.shippingAddress.state} {checkoutData.shippingAddress.zip}<br />
            {checkoutData.shippingAddress.country}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-start">
            <div className="text-blue-600 mr-4 text-2xl">🔒</div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Secure Payment with Stripe</h3>
              <p className="text-sm text-blue-800">
                Your payment information is encrypted and secure. We use Stripe to process payments safely.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-primary-600 text-white py-4 rounded-lg hover:bg-primary-700 transition font-semibold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : `Pay $${calculateTotal().toFixed(2)} with Stripe`}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          By clicking "Pay", you agree to our terms and conditions
        </p>

        <button
          onClick={() => router.push('/checkout')}
          className="w-full mt-4 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
        >
          ← Back to Checkout
        </button>
      </div>
    </div>
  );
}