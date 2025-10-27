'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
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
        
        <Link
          href={`/product/${product.id}`}
          className="btn-3d block w-full text-white text-center py-2 rounded-lg font-semibold text-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}