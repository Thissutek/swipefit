import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand and about */}
          <div>
            <h3 className="text-lg font-bold">
              Swipe<span className="text-primary">Fit</span>
            </h3>
            <p className="mt-4 text-sm text-gray-600">
              We offer the latest fashion trends for men and women. Quality clothes with worldwide shipping.
            </p>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">Shop</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/products/men" className="text-sm text-gray-600 hover:text-primary">
                  Men's Clothing
                </Link>
              </li>
              <li>
                <Link href="/products/women" className="text-sm text-gray-600 hover:text-primary">
                  Women's Clothing
                </Link>
              </li>
              <li>
                <Link href="/products/accessories" className="text-sm text-gray-600 hover:text-primary">
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="/products/sale" className="text-sm text-gray-600 hover:text-primary">
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">Customer Service</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-primary">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-primary">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-600 hover:text-primary">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">Stay Connected</h3>
            <p className="mt-4 text-sm text-gray-600">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <form className="mt-4">
              <div className="flex max-w-md">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full flex-1 rounded-l-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <button
                  type="submit"
                  className="rounded-r-md bg-primary px-4 py-2 text-white hover:bg-primary-dark"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-600">
            &copy; {new Date().getFullYear()} StylishThreads. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
