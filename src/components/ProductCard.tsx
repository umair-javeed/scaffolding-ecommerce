'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [weight, setWeight] = useState(100);
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg');
  const [added, setAdded] = useState(false);

  // Calculate current price based on selected unit
  const currentPrice = unit === 'kg' ? product.pricePerKg : product.pricePerLb;
  const totalPrice = weight * currentPrice;

  const handleAddToCart = () => {
    // Get existing cart from localStorage
    const existingCart = localStorage.getItem('cart');
    const cart = existingCart ? JSON.parse(existingCart) : [];
    
    // Add new item with correct price for selected unit
    const cartItem = {
      id: product.id,
      name: product.name,
      weight,
      unit,
      pricePerUnit: currentPrice, // Use calculated current price
      image: product.image
    };
    
    cart.push(cartItem);
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show feedback
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
      <div className="relative h-48 bg-gray-200">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="mb-3 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Price per KG:</span>
            <span className="text-primary-600 font-bold">${product.pricePerKg.toFixed(2)}/kg</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Price per LB:</span>
            <span className="text-primary-600 font-bold">${product.pricePerLb.toFixed(2)}/lb</span>
          </div>
        </div>
        
        <p className="text-green-600 text-sm mb-3">
          In Stock ({product.stock.toLocaleString()} kg available)
        </p>

        {/* Weight Input */}
        <div className="mb-3 flex gap-2">
          <input
            type="number"
            min="1"
            value={weight}
            onChange={(e) => setWeight(parseInt(e.target.value) || 1)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Weight"
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as 'kg' | 'lb')}
            className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="kg">KG</option>
            <option value="lb">LB</option>
          </select>
        </div>

        {/* Price Display - Updates with unit change */}
        <div className="mb-3 bg-gray-50 p-3 rounded">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Current Price:</span>
            <span className="text-lg font-bold text-primary-600">
              ${currentPrice.toFixed(2)}/{unit}
            </span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-gray-600">Total:</span>
            <span className="text-xl font-bold text-primary-700">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className={`w-full py-2 rounded-lg font-semibold text-sm transition ${
            added 
              ? 'bg-green-600 text-white' 
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
        >
          {added ? '✓ Added to Cart!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}