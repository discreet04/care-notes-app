import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import Landing from "./pages/Landing";
import LoginSignup from "./pages/LoginSignup";
import RoleSelection from "./pages/RoleSelection";
import PatientDashboard from "./pages/PatientDashboard";
import CaretakerDashboard from "./pages/CaretakerDashboard";
import NotFound from "./pages/NotFound";
import { useState, useEffect } from 'react';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<LoginSignup />} />
            <Route path="/role-selection" element={<RoleSelection />} />
            <Route path="/patient" element={<PatientDashboard />} />
            <Route path="/caretaker" element={<CaretakerDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
