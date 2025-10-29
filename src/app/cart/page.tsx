'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { products as productData } from '@/lib/products';

interface CartItem {
  id: number;
  name: string;
  weight: number;
  unit: 'kg' | 'lb';
  pricePerUnit: number;
  image: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setLoading(false);
  }, []);

  const removeItem = (index: number) => {
    const newCart = cartItems.filter((_, i) => i !== index);
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateWeight = (index: number, value: string | number) => {
    const newCart = [...cartItems];
    const numValue = typeof value === 'string' ? parseInt(value) || 0 : value;
    newCart[index].weight = numValue;
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateUnit = (index: number, newUnit: 'kg' | 'lb') => {
    const newCart = [...cartItems];
    const item = newCart[index];
    
    // Find the product to get correct prices
    const product = productData.find(p => p.id === item.id);
    
    if (product) {
      // Update unit
      item.unit = newUnit;
      
      // Update price based on new unit
      item.pricePerUnit = newUnit === 'kg' ? product.pricePerKg : product.pricePerLb;
    }
    
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      return sum + (item.weight * item.pricePerUnit);
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-xl">Loading cart...</div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">Add some scaffolding materials to get started!</p>
          <Link
            href="/"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-gray-50 py-12">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 font-semibold"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0 bg-gray-200 rounded">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                      sizes="96px"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                    
                    <div className="flex flex-wrap gap-4 items-center mb-3">
                      <div className="flex gap-2 items-center">
                        <label className="text-sm text-gray-600">Weight:</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={item.weight === 0 ? '' : item.weight.toString()}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '') {
                              updateWeight(index, 0);
                            } else if (/^\d+$/.test(value)) {
                              updateWeight(index, parseInt(value));
                            }
                          }}
                          onFocus={(e) => e.target.select()}
                          onBlur={(e) => {
                            if (e.target.value === '' || parseInt(e.target.value) < 1) {
                              updateWeight(index, 1);
                            }
                          }}
                          placeholder="Enter weight"
                          className="w-28 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div className="flex gap-2 items-center">
                        <label className="text-sm text-gray-600">Unit:</label>
                        <select
                          value={item.unit}
                          onChange={(e) => updateUnit(index, e.target.value as 'kg' | 'lb')}
                          className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="kg">KG</option>
                          <option value="lb">LB</option>
                        </select>
                      </div>

                      <div className="text-sm text-gray-600">
                        Price: ${item.pricePerUnit.toFixed(2)}/{item.unit}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-xl font-bold text-primary-600">
                        ${(item.weight * item.pricePerUnit).toFixed(2)}
                      </div>
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700 text-sm font-semibold"
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
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Items:</span>
                  <span>{cartItems.length}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-primary-600">${calculateTotal().toFixed(2)}</span>
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
                className="block w-full bg-gray-200 text-gray-800 text-center py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}