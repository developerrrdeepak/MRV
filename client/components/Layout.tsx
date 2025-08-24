import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  TreePine,
  Wheat,
  Menu,
  X,
  Satellite,
  Leaf,
  User,
  LogOut,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import EnhancedAuthModal from "./EnhancedAuthModal";
import EnhancedAIChatbot from "./EnhancedAIChatbot";
import LanguageSelector, { useLanguage } from "./LanguageSelector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { language, changeLanguage } = useLanguage();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Solutions", href: "/solutions" },
    { name: "MRV Prototype", href: "/tools" },
    { name: "Farmer App", href: "/case-studies" },
    { name: "About Us", href: "/about" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <header className="bg-white/90 backdrop-blur-xl border-b border-emerald-100/50 sticky top-0 z-50 shadow-lg shadow-emerald-100/50">
        <nav
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          aria-label="Top"
        >
          <div className="flex w-full items-center justify-between py-4">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative transform group-hover:scale-110 transition-transform duration-300">
                  <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-amber-500 p-3 rounded-2xl shadow-xl shadow-green-200 group-hover:shadow-2xl group-hover:shadow-green-300 transition-all duration-300">
                    <TreePine className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-orange-500 to-amber-500 p-1.5 rounded-full shadow-lg animate-pulse">
                    <Wheat className="h-4 w-4 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-amber-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-display font-black bg-gradient-to-r from-green-600 via-emerald-600 to-amber-500 bg-clip-text text-transparent tracking-tight leading-none group-hover:scale-105 transition-transform duration-300">
                    Carbon Roots
                  </span>
                  <span className="text-xs font-bold text-gray-600 tracking-wider bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    🌾 KISAN CARBONTECH
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "relative text-sm font-bold transition-all duration-300 hover:text-emerald-600 hover:scale-110 px-4 py-2 rounded-full",
                    location.pathname === item.href
                      ? "text-emerald-600 bg-emerald-50 shadow-md"
                      : "text-gray-700 hover:bg-emerald-50/50",
                  )}
                >
                  {item.name}
                  {location.pathname === item.href && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-emerald-600 rounded-full"></div>
                  )}
                </Link>
              ))}

              {/* Language Selector */}
              <LanguageSelector
                selectedLanguage={language}
                onLanguageChange={changeLanguage}
              />

              {/* AI Chatbot Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setChatbotOpen(true)}
                className="flex items-center space-x-2 border-2 border-green-300 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 text-green-700 hover:text-green-800 font-bold shadow-md hover:shadow-lg transition-all duration-300 rounded-full px-4 py-2"
              >
                <MessageCircle className="h-4 w-4 animate-pulse" />
                <span className="hidden lg:inline">🤖 Kisan AI</span>
              </Button>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <span>
                        {user?.farmer?.name ||
                          user?.admin?.name ||
                          user?.farmer?.email ||
                          user?.admin?.email}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        to={
                          user?.type === "farmer"
                            ? "/farmer-dashboard"
                            : "/admin-dashboard"
                        }
                      >
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={() => setAuthModalOpen(true)}
                  className="bg-gradient-to-r from-green-600 via-emerald-600 to-amber-500 hover:from-green-700 hover:via-emerald-700 hover:to-amber-600 font-bold text-sm tracking-wide shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-full px-6 py-3"
                >
                  <User className="mr-2 h-4 w-4" />
                  🚜 Farmer Login
                </Button>
              )}
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

                {/* Mobile Language Selector & Chatbot */}
                <div className="px-3 pt-2 space-y-2 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <LanguageSelector
                        selectedLanguage={language}
                        onLanguageChange={changeLanguage}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setChatbotOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 border-green-200 hover:bg-green-50"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>AI Help</span>
                    </Button>
                  </div>
                </div>

                <div className="px-3 pt-2">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full" asChild>
                        <Link
                          to={
                            user?.type === "farmer"
                              ? "/farmer-dashboard"
                              : "/admin-dashboard"
                          }
                        >
                          Dashboard
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={logout}
                        className="w-full text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setAuthModalOpen(true)}
                      className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-amber-500 hover:from-green-700 hover:via-emerald-700 hover:to-amber-600 font-bold tracking-wide"
                    >
                      Sign in (Farmer)
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      <main>{children}</main>

      <footer className="bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-2xl shadow-xl">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
                <div>
                  <span className="text-3xl font-display font-black tracking-tight bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    Carbon Roots
                  </span>
                  <p className="text-green-400 text-sm font-bold">🌾 किसानों का भविष्य</p>
                </div>
              </div>
              <p className="text-gray-300 max-w-md leading-relaxed font-medium text-lg mb-6">
                भारत के smallholder farming communities के लिए scalable और affordable
                carbon farming solutions enable करते हैं।
              </p>
              <div className="flex space-x-4">
                <div className="bg-green-600/20 p-3 rounded-full">
                  <span className="text-green-400 font-bold">🌱 Sustainable</span>
                </div>
                <div className="bg-blue-600/20 p-3 rounded-full">
                  <span className="text-blue-400 font-bold">🔬 Tech-Driven</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6 tracking-wide text-green-400 flex items-center">
                <Zap className="mr-2 h-5 w-5" />
                Solutions
              </h3>
              <ul className="space-y-3 text-gray-300 font-medium">
                <li>
                  <Link
                    to="/solutions"
                    className="hover:text-green-400 transition-all duration-300 flex items-center hover:translate-x-2"
                  >
                    <TreePine className="mr-2 h-4 w-4" />
                    MRV Prototypes
                  </Link>
                </li>
                <li>
                  <Link
                    to="/tools"
                    className="hover:text-green-400 transition-all duration-300 flex items-center hover:translate-x-2"
                  >
                    <Smartphone className="mr-2 h-4 w-4" />
                    Data Collection
                  </Link>
                </li>
                <li>
                  <Link
                    to="/case-studies"
                    className="hover:text-green-400 transition-all duration-300 flex items-center hover:translate-x-2"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Verification
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources"
                    className="hover:text-green-400 transition-all duration-300 flex items-center hover:translate-x-2"
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Reporting
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6 tracking-wide text-emerald-400 flex items-center">
                <Award className="mr-2 h-5 w-5" />
                Resources
              </h3>
              <ul className="space-y-3 text-gray-300 font-medium">
                <li>
                  <Link
                    to="/resources"
                    className="hover:text-emerald-400 transition-all duration-300 flex items-center hover:translate-x-2"
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/case-studies"
                    className="hover:text-emerald-400 transition-all duration-300 flex items-center hover:translate-x-2"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources"
                    className="hover:text-emerald-400 transition-all duration-300 flex items-center hover:translate-x-2"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources"
                    className="hover:text-emerald-400 transition-all duration-300 flex items-center hover:translate-x-2"
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    24/7 Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-center md:text-left font-medium mb-4 md:mb-0">
                © 2024 Carbon Roots. All rights reserved.
                <span className="text-green-400 font-bold block md:inline md:ml-2">
                  🌱 Empowering climate-smart agriculture through technology.
                </span>
              </p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center text-green-400">
                  <Heart className="h-4 w-4 mr-1 animate-pulse" />
                  <span className="text-sm font-medium">Made with love for farmers</span>
                </div>
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 rounded-full">
                  <span className="text-white text-sm font-bold">🇮🇳 Made in India</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <EnhancedAuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      <EnhancedAIChatbot
        open={chatbotOpen}
        onOpenChange={setChatbotOpen}
        selectedLanguage={language}
      />

      {/* Floating AI Assistant Button */}
      {!chatbotOpen && (
        <Button
          onClick={() => setChatbotOpen(true)}
          className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-gradient-to-r from-green-600 via-emerald-600 to-amber-500 shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 border-2 border-white"
          size="sm"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}
    </div>
  );
}
