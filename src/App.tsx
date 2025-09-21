import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import Landing from "./pages/Landing";
import LoginSignup from "./pages/LoginSignup";
import RoleSelection from "./pages/RoleSelection";
import PatientDashboard from "./pages/PatientDashboard";
import CaretakerDashboard from "./pages/CaretakerDashboard";
import NotFound from "./pages/NotFound";
import { useState, useEffect } from 'react';

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for authenticated user on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('careconnect_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        // If invalid JSON, clear it
        localStorage.removeItem('careconnect_user');
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading CareConnect...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route 
                path="/" 
                element={user ? <Navigate to={user.role === 'patient' ? '/patient' : '/caretaker'} replace /> : <Landing />} 
              />
              <Route 
                path="/login" 
                element={user ? <Navigate to={user.role === 'patient' ? '/patient' : '/caretaker'} replace /> : <LoginSignup />} 
              />
              <Route path="/role-selection" element={<RoleSelection />} />
              <Route 
                path="/patient" 
                element={user && user.role === 'patient' ? <PatientDashboard /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="/caretaker" 
                element={user && user.role === 'caretaker' ? <CaretakerDashboard /> : <Navigate to="/login" replace />} 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;