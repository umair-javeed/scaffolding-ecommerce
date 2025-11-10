'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getProducts } from '@/lib/api';

interface Product {
  productId: number;
  name: string;
  category: string;
  description: string;
  pricePerKg: number;
  pricePerLb: number;
  image: string;
  stockQuantity: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const addToCart = (product: Product, weight: number, unit: 'kg' | 'lb') => {
    const pricePerUnit = unit === 'kg' ? product.pricePerKg : product.pricePerLb;
    
    const cartItem = {
      id: product.productId,
      name: product.name,
      weight: weight,
      unit: unit,
      pricePerUnit: pricePerUnit,
      image: product.image
    };

    const updatedCart = [...cart, cartItem];
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    alert(`Added ${weight} ${unit} of ${product.name} to cart!`);
  };

  const handleAddToCart = (product: Product, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const weight = parseFloat(formData.get('weight') as string);
    const unit = formData.get('unit') as 'kg' | 'lb';

    if (weight <= 0) {
      alert('Please enter a valid weight');
      return;
    }

    addToCart(product, weight, unit);
    e.currentTarget.reset();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold">Loading products...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-600">{error}</h2>
          <button
            onClick={loadProducts}
            className="mt-4 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">Our Products</h1>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.productId} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                <div className="relative h-64">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="p-6">
                  <div className="mb-2">
                    <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded">
                      {product.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                  
                  <div className="mb-4">
                    <p className="text-lg font-bold text-primary-600">
                      ${product.pricePerKg.toFixed(2)}/kg
                    </p>
                    <p className="text-sm text-gray-600">
                      ${product.pricePerLb.toFixed(2)}/lb
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Stock: {product.stockQuantity} units
                    </p>
                  </div>

                  <form onSubmit={(e) => handleAddToCart(product, e)}>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="number"
                        name="weight"
                        min="1"
                        step="0.1"
                        defaultValue="1"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                      <select
                        name="unit"
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="kg">kg</option>
                        <option value="lb">lb</option>
                      </select>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
                    >
                      Add to Cart
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}