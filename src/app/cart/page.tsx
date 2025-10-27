'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CartItem {
  id: number;
  name: string;
  pricePerKg: number;
  pricePerLb: number;
  weight: number;
  unit: 'kg' | 'lb';
  image: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "MS Scaffolding Pipes",
      pricePerKg: 2.50,
      pricePerLb: 1.13,
      weight: 100,
      unit: 'kg',
      image: "/images/ms-pipes.jpg"
    },
    {
      id: 2,
      name: "Scaffold Clamps & Couplers",
      pricePerKg: 3.80,
      pricePerLb: 1.72,
      weight: 50,
      unit: 'kg',
      image: "/images/scaffold-clamps.jpg"
    }
  ]);

  const updateWeight = (id: number, newWeight: number) => {
    if (newWeight < 0) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, weight: newWeight } : item
    ));
  };

  const updateUnit = (id: number, newUnit: 'kg' | 'lb') => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, unit: newUnit } : item
    ));
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const calculateItemTotal = (item: CartItem) => {
    const price = item.unit === 'kg' ? item.pricePerKg : item.pricePerLb;
    return price * item.weight;
  };

  const subtotal = cartItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  const shipping = subtotal > 500 ? 0 : 50.00;
  const total = subtotal + shipping;

  return (
    <div className="min-h-[80vh] bg-gray-50 py-12">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
            <Link 
              href="/"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative w-24 h-24 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                      
                      <div className="mb-3">
                        <p className="text-sm text-gray-600">
                          ${item.unit === 'kg' ? item.pricePerKg.toFixed(2) : item.pricePerLb.toFixed(2)} per {item.unit.toUpperCase()}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-semibold">Weight:</label>
                          <input
                            type="number"
                            min="0"
                            step="0.1"
                            value={item.weight}
                            onChange={(e) => updateWeight(item.id, parseFloat(e.target.value) || 0)}
                            className="w-24 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="text-sm font-semibold">Unit:</label>
                          <select
                            value={item.unit}
                            onChange={(e) => updateUnit(item.id, e.target.value as 'kg' | 'lb')}
                            className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="kg">KG</option>
                            <option value="lb">LB</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-primary-600">
                          ${calculateItemTotal(item).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 font-semibold text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-green-600">
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary-600">${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <Link
                  href="/checkout"
                  className="block w-full bg-primary-600 text-white text-center py-3 rounded-lg hover:bg-primary-700 transition font-semibold mb-4"
                >
                  Proceed to Checkout
                </Link>
                
                <Link
                  href="/"
                  className="block w-full text-center text-primary-600 hover:text-primary-700 font-semibold"
                >
                  Continue Shopping
                </Link>
                
                {shipping > 0 && (
                  <p className="text-sm text-gray-600 mt-4 text-center bg-yellow-50 p-3 rounded">
                    Add ${(500 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}