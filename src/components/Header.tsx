'use client';

import { useState } from 'react'; // ⬅️ ADD THIS
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export default function Header() {
  const { user, signOut, isAuthenticated, loading } = useAuth();
  const { cart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // ⬅️ ADD THIS

  const cartItemsCount = cart.reduce((sum, item) => sum + item.weight, 0);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            Javed Scaffolding Pipe Store
          </Link>

          {/* ⬇️ ADD HAMBURGER BUTTON - START */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          {/* ⬆️ ADD HAMBURGER BUTTON - END */}

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-primary-600 transition">
              Products
            </Link>
            {isAuthenticated && (
              <Link href="/orders" className="text-gray-700 hover:text-primary-600 transition">
                Your Orders
              </Link>
            )}
            <Link href="/purchase" className="text-gray-700 hover:text-primary-600 transition">
              Purchase
            </Link>
            <Link href="/cart" className="text-gray-700 hover:text-primary-600 transition relative">
              Cart
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="text-gray-500">Loading...</div>
            ) : isAuthenticated && user ? (
              <>
                <span className="text-gray-700 hidden md:inline">
                  Hello, {user.name || user.username}
                </span>
                <button
                  onClick={() => signOut()}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-primary-600 transition"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* ⬇️ ADD MOBILE MENU - START */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 mt-2">
            <nav className="flex flex-col space-y-3 pt-4">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-primary-600 transition py-2"
              >
                Home
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-primary-600 transition py-2"
              >
                Products
              </Link>
              {isAuthenticated && (
                <Link
                  href="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-primary-600 transition py-2"
                >
                  Your Orders
                </Link>
              )}
              <Link
                href="/purchase"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-primary-600 transition py-2"
              >
                Purchase
              </Link>
              <Link
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-primary-600 transition py-2 flex items-center"
              >
                Cart
                {cartItemsCount > 0 && (
                  <span className="ml-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              <div className="pt-4 border-t border-gray-200 space-y-3">
                {loading ? (
                  <div className="text-gray-500">Loading...</div>
                ) : isAuthenticated && user ? (
                  <>
                    <div className="text-gray-700 py-2">
                      Hello, {user.name || user.username}
                    </div>
                    <button
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-left"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-gray-700 hover:text-primary-600 transition py-2"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition text-center"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
        {/* ⬆️ ADD MOBILE MENU - END */}

      </div>
    </header>
  );
}