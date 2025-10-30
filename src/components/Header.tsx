import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <nav className="container-custom py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            Javed Scaffolding Pipe Store
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition">
              Home
            </Link>
            <Link href="/#products" className="text-gray-700 hover:text-primary-600 transition">
              Products
            </Link>
            <Link href="/orders" className="text-gray-700 hover:text-primary-600 transition">
              Your Orders
            </Link>
            <Link href="/cart" className="text-gray-700 hover:text-primary-600 transition">
              Cart
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              href="/login" 
              className="text-gray-700 hover:text-primary-600 transition"
            >
              Login
            </Link>
            <Link 
              href="/signup" 
              className="btn-3d text-white px-6 py-2.5 rounded-lg font-bold inline-block"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}