import { useState } from 'react';
import Link from 'next/link';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative">
      {/* Hamburger menu for mobile */}
      <button
        className="md:hidden fixed right-4 top-4 z-50 text-white p-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile menu */}
      <nav
        className={`${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } md:translate-x-0 fixed md:relative top-0 right-0 h-screen md:h-auto w-64 md:w-auto bg-black/80 md:bg-white/30 backdrop-blur-md md:rounded-full px-4 py-16 md:py-2 md:px-6 shadow-md transition-transform duration-300 ease-in-out z-40 md:z-auto`}
      >
        <div className="flex flex-col md:flex-row gap-6 md:gap-6">
          <Link
            href="/"
            className="text-white md:text-black hover:underline"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-white md:text-black hover:underline"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/mappage"
            className="text-white md:text-black hover:underline"
            onClick={() => setIsMenuOpen(false)}
          >
            MapPage
          </Link>
          <Link
            href="/converter"
            className="text-white md:text-black hover:underline"
            onClick={() => setIsMenuOpen(false)}
          >
            Converter
          </Link>
          <Link
            href="/comparison"
            className="text-white md:text-black hover:underline"
            onClick={() => setIsMenuOpen(false)}
          >
            Comparison
          </Link>
        </div>
      </nav>
    </div>
  );
} 