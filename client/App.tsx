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
import FarmerAuth from "./pages/FarmerAuth";
import FarmerDashboard from "./pages/FarmerDashboard";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
            <Route path="/farmer-auth" element={<FarmerAuth />} />
            <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
