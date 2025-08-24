import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TreePine, Wheat, Menu, X, Satellite, Leaf } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Solutions", href: "/solutions" },
    { name: "MRV Prototype", href: "/tools" },
    { name: "Farmer App", href: "/case-studies" },
    { name: "Hackathon", href: "/resources" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50">
        <nav
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          aria-label="Top"
        >
          <div className="flex w-full items-center justify-between py-4">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <div className="relative">
                  <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-amber-500 p-2 rounded-xl shadow-lg">
                    <TreePine className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-orange-500 p-1 rounded-full">
                    <Wheat className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-display font-black bg-gradient-to-r from-green-600 via-emerald-600 to-amber-500 bg-clip-text text-transparent tracking-tight leading-none">
                    Carbon Roots
                  </span>
                  <span className="text-xs font-semibold text-gray-600 tracking-wide">
                    KISAN CARBONTECH
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex md:items-center md:space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-sm font-semibold transition-all duration-200 hover:text-emerald-600 hover:scale-105",
                    location.pathname === item.href
                      ? "text-emerald-600 font-bold"
                      : "text-gray-700",
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex items-center space-x-3">
                <Link to="/farmer-auth">
                  <Button className="bg-gradient-to-r from-green-600 via-emerald-600 to-amber-500 hover:from-green-700 hover:via-emerald-700 hover:to-amber-600 font-bold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all duration-200">
                    Sign In Farmer
                  </Button>
                </Link>
                <Link to="/admin-auth">
                  <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-sm tracking-wide shadow-sm hover:shadow-md transition-all duration-200">
                    Admin
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="space-y-1 pb-3 pt-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "block rounded-md px-3 py-2 text-base font-semibold transition-all duration-200",
                      location.pathname === item.href
                        ? "bg-emerald-50 text-emerald-600 font-bold"
                        : "text-gray-700 hover:bg-gray-50 hover:text-emerald-600",
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="px-3 pt-2 space-y-2">
                  <Link to="/farmer-auth" className="block">
                    <Button className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-amber-500 hover:from-green-700 hover:via-emerald-700 hover:to-amber-600 font-bold tracking-wide">
                      Sign In Farmer
                    </Button>
                  </Link>
                  <Link to="/admin-auth" className="block">
                    <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold tracking-wide">
                      Admin Login
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      <main>{children}</main>

      <footer className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-2 rounded-lg">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-display font-extrabold tracking-tight">
                  CarbonMRV
                </span>
              </div>
              <p className="text-gray-400 max-w-md leading-relaxed font-medium">
                Enabling scalable and affordable MRV solutions for agroforestry
                and rice-based carbon projects across India's smallholder
                farming communities.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold mb-4 tracking-wide uppercase">
                Solutions
              </h3>
              <ul className="space-y-2 text-sm text-gray-400 font-medium">
                <li>
                  <Link
                    to="/solutions"
                    className="hover:text-white transition-colors"
                  >
                    MRV Prototypes
                  </Link>
                </li>
                <li>
                  <Link
                    to="/tools"
                    className="hover:text-white transition-colors"
                  >
                    Data Collection
                  </Link>
                </li>
                <li>
                  <Link
                    to="/case-studies"
                    className="hover:text-white transition-colors"
                  >
                    Verification
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources"
                    className="hover:text-white transition-colors"
                  >
                    Reporting
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold mb-4 tracking-wide uppercase">
                Resources
              </h3>
              <ul className="space-y-2 text-sm text-gray-400 font-medium">
                <li>
                  <Link
                    to="/resources"
                    className="hover:text-white transition-colors"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/case-studies"
                    className="hover:text-white transition-colors"
                  >
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources"
                    className="hover:text-white transition-colors"
                  >
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources"
                    className="hover:text-white transition-colors"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-sm text-gray-400 text-center font-medium">
              © 2024 CarbonMRV. All rights reserved. Empowering climate-smart
              agriculture through technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
