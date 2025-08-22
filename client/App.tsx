import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Solutions from "./pages/Solutions";
import Tools from "./pages/Tools";
import CaseStudies from "./pages/CaseStudies";
import Resources from "./pages/Resources";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import FarmerAuth from "./pages/FarmerAuth";
import FarmerDashboard from "./pages/FarmerDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes with Layout */}
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/solutions" element={<Layout><Solutions /></Layout>} />
          <Route path="/tools" element={<Layout><Tools /></Layout>} />
          <Route path="/case-studies" element={<Layout><CaseStudies /></Layout>} />
          <Route path="/resources" element={<Layout><Resources /></Layout>} />

          {/* Farmer portal routes without main Layout */}
          <Route path="/farmer/auth" element={<FarmerAuth />} />
          <Route path="/farmer/dashboard" element={<FarmerDashboard />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
