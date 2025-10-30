'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createOrder } from '@/lib/api';

interface CartItem {
  id: number;
  name: string;
  weight: number;
  unit: 'kg' | 'lb';
  pricePerUnit: number;
  image: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      return sum + (item.weight * item.pricePerUnit);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      setError('Your cart is empty! Please add items before checkout.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData(e.currentTarget);
      
      const totalAmount = calculateTotal();
      
      const order = {
        customerEmail: formData.get('email') as string,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          weight: item.weight,
          unit: item.unit,
          pricePerUnit: item.pricePerUnit
        })),
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        shippingAddress: {
          street: formData.get('address') as string,
          city: formData.get('city') as string,
          state: formData.get('state') as string,
          zip: formData.get('zip') as string,
          country: formData.get('country') as string
        }
      };

      console.log('Submitting order:', order);

      const response = await createOrder(order);
      
      if (response.success) {
        setOrderId(response.orderId);
        setOrderPlaced(true);
        // Clear cart after successful order
        localStorage.removeItem('cart');
      } else {
        setError('Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error('Order error:', err);
      setError('Error placing order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-[60vh] bg-gray-50 py-12">
        <div className="container-custom max-w-2xl text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-green-600 mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-xl mb-2">Order ID: <strong>{orderId}</strong></p>
            <p className="text-gray-600 mb-6">
              You will receive a confirmation email shortly.
            </p>
            <div className="space-y-3">
              <Link
                href="/orders"
                className="block w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
              >
                View Your Orders
              </Link>
              <button
                onClick={() => router.push('/')}
                className="block w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-gray-50 py-12">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        {error && (
          <div className="max-w-2xl mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {cartItems.length === 0 && (
          <div className="max-w-2xl mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
            Your cart is empty! Please add items before checkout.
          </div>
        )}

        {/* Order Summary - Show before form */}
        {cartItems.length > 0 && (
          <div className="max-w-2xl mb-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            {cartItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center mb-2 pb-2 border-b">
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
        )}

        <form onSubmit={handleSubmit} className="max-w-2xl">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Email Address *</label>
              <input
                name="email"
                type="email"
                required
                placeholder="your.email@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Street Address *</label>
              <input
                name="address"
                type="text"
                required
                placeholder="123 Main Street"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-2">City *</label>
                <input
                  name="city"
                  type="text"
                  required
                  placeholder="New York"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">State *</label>
                <input
                  name="state"
                  type="text"
                  required
                  placeholder="NY"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-2">ZIP Code *</label>
                <input
                  name="zip"
                  type="text"
                  required
                  placeholder="10001"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Country *</label>
                <input
                  name="country"
                  type="text"
                  required
                  placeholder="USA"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || cartItems.length === 0}
            className="w-full bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition font-semibold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing Order...' : `Place Order - $${calculateTotal().toFixed(2)}`}
          </button>

          <p className="text-sm text-gray-600 mt-4 text-center">
            By placing this order, you agree to our terms and conditions.
          </p>
        </form>
      </div>
    </div>
  );
}