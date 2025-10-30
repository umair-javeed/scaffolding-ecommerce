'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-primary-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold hover:text-primary-100 transition">
            Javed Scaffolding Pipe Store
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="hover:text-primary-300 transition">
              Home
            </Link>
            <Link href="/#products" className="hover:text-primary-300 transition">
              Products
            </Link>
            <Link href="/orders" className="hover:text-primary-300 transition">
              Your Orders
            </Link>
            <Link href="/cart" className="hover:text-primary-300 transition">
              Cart
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex space-x-4">
            <Link 
              href="/login"
              className="hover:text-primary-300 transition"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-primary-700 px-6 py-2 rounded-lg hover:bg-primary-800 transition font-semibold"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <Link href="/" className="block py-2 hover:text-primary-300 transition">
              Home
            </Link>
            <Link href="/#products" className="block py-2 hover:text-primary-300 transition">
              Products
            </Link>
            <Link href="/orders" className="block py-2 hover:text-primary-300 transition">
              Your Orders
            </Link>
            <Link href="/cart" className="block py-2 hover:text-primary-300 transition">
              Cart
            </Link>
            <Link href="/login" className="block py-2 hover:text-primary-300 transition">
              Login
            </Link>
            <Link href="/signup" className="block py-2 hover:text-primary-300 transition">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}