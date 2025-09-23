import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CollectorDashboard from "./pages/CollectorDashboard";
import ProcessorDashboard from "./pages/ProcessorDashboard";
import ConsumerPortal from "./pages/ConsumerPortal";
import AdminDashboard from "./pages/AdminDashboard";
import QRScanner from "./pages/QRScanner";
import BlockchainProvider from "./contexts/BlockchainContext";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BlockchainProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-secondary">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/collector" element={<CollectorDashboard />} />
              <Route path="/processor" element={<ProcessorDashboard />} />
              <Route path="/consumer" element={<ConsumerPortal />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/scanner" element={<QRScanner />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </BlockchainProvider>
  </QueryClientProvider>
);

export default App;
