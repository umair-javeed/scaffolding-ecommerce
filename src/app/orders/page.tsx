'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface OrderItem {
  id: number;
  name: string;
  weight: number;
  unit: string;
  pricePerUnit: number;
}

interface Order {
  orderId: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: number;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export default function OrdersPage() {
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const searchOrders = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      // Call API to get orders by email
      const response = await fetch(
        `https://844b95xljc.execute-api.us-east-1.amazonaws.com/prod/orders?email=${encodeURIComponent(email)}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Error fetching orders. Please try again.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-[80vh] bg-gray-50 py-12">
      <div className="container-custom max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={searchOrders}>
            <label className="block text-sm font-semibold mb-2">
              Enter your email to view orders
            </label>
            <div className="flex gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition font-semibold disabled:bg-gray-400"
              >
                {loading ? 'Searching...' : 'Search Orders'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
              {error}
            </div>
          )}
        </div>

        {/* Orders List */}
        {searched && !loading && (
          <>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h2 className="text-2xl font-bold mb-2">No Orders Found</h2>
                <p className="text-gray-600 mb-6">
                  No orders found for {email}
                </p>
                <Link
                  href="/"
                  className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-gray-600">
                  Found {orders.length} order{orders.length !== 1 ? 's' : ''} for {email}
                </p>

                {orders.map((order) => (
                  <div key={order.orderId} className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Order Header */}
                    <div className="bg-gray-50 px-6 py-4 border-b">
                      <div className="flex flex-wrap justify-between items-start gap-4">
                        <div>
                          <h3 className="font-bold text-lg">Order #{order.orderId}</h3>
                          <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                            {order.status.toUpperCase()}
                          </span>
                          <p className="text-lg font-bold text-primary-600 mt-2">
                            ${order.totalAmount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6">
                      <h4 className="font-semibold mb-3">Items:</h4>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center pb-3 border-b last:border-b-0">
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
                      </div>

                      {/* Shipping Address */}
                      {order.shippingAddress && (
                        <div className="mt-6 pt-6 border-t">
                          <h4 className="font-semibold mb-2">Shipping Address:</h4>
                          <p className="text-gray-600 text-sm">
                            {order.shippingAddress.street}<br />
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
                            {order.shippingAddress.country}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}