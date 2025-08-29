import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Solutions from "./pages/Solutions";
import Tools from "./pages/Tools";
import CaseStudies from "./pages/CaseStudies";
import Resources from "./pages/Resources";
import Estimator from "./pages/Estimator";
import NotFound from "./pages/NotFound";
import FarmerDashboard from "./pages/FarmerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AboutUs from "./pages/AboutUs";
import TestEmail from "./pages/TestEmail";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/solutions" element={<Solutions />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/case-studies" element={<CaseStudies />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/estimator" element={<Estimator />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              {/* Development only routes */}
              {import.meta.env.DEV && (
                <Route path="/test-email" element={<TestEmail />} />
              )}
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
