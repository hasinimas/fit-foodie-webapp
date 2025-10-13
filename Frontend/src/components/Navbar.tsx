import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import { MenuIcon, XIcon } from 'lucide-react';
const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="h-8 w-8 bg-emerald-500 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-lg">FF</span>
              </div>
              <h1 className="ml-2 text-xl font-bold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
                Fit Foodie
              </h1>
            </Link>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-xl text-gray-500 hover:text-emerald-600 font-medium">
              Home
            </Link>
            <Link to="/features" className="text-xl text-gray-500 hover:text-emerald-600 font-medium">
              Features
            </Link>
            <Link to="/about" className="text-xl text-gray-500 hover:text-emerald-600 font-medium">
              About Us
            </Link>
            <Link to="/pricing" className="text-xl text-gray-500 hover:text-emerald-600 font-medium">
              Pricing
            </Link>
          </nav>
          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-5">
            <Link to="/login">
              <Button variant="outline" size="lg">
                Log In
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg">Sign Up Free</Button>
            </Link>
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-900 focus:outline-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {mobileMenuOpen && <div className="md:hidden bg-white border-b border-gray-200 py-2">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link to="/" className="block py-2 text-gray-700 hover:text-emerald-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/features" className="block py-2 text-gray-700 hover:text-emerald-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
              Features
            </Link>
            <Link to="/about" className="block py-2 text-gray-700 hover:text-emerald-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
              About Us
            </Link>
            <Link to="/pricing" className="block py-2 text-gray-700 hover:text-emerald-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
              Pricing
            </Link>
            <div className="pt-4 flex flex-col space-y-2">
              <Link to="/login">
                <Button variant="outline" size="sm" fullWidth>
                  Log In
                </Button>
              </Link>
              <Link to="/login">
                <Button size="sm" fullWidth>
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        </div>}
    </header>;
};
export default Navbar;