import Link from 'next/link';
import AuthButton from './AuthButton';
import CartIcon from './CartIcon';

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          Swipe<span className="text-primary">Fit</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden space-x-8 md:flex">
          <Link href="/" className="text-sm font-medium hover:text-primary">
            Home
          </Link>
          <Link href="/products" className="text-sm font-medium hover:text-primary">
            All Products
          </Link>
          <Link href="/products/men" className="text-sm font-medium hover:text-primary">
            Men
          </Link>
          <Link href="/products/women" className="text-sm font-medium hover:text-primary">
            Women
          </Link>
          <Link href="/products/accessories" className="text-sm font-medium hover:text-primary">
            Accessories
          </Link>
        </nav>

        {/* Auth and Cart */}
        <div className="flex items-center space-x-6">
          <AuthButton />
          <CartIcon />
        </div>
      </div>
    </header>
  );
}
