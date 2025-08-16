import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Availability from "./pages/Availability";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import NotFound from "./pages/NotFound";
import RescheduleToken from "./pages/RescheduleToken";
import ProfessionalDashboard from "./pages/dashboard/Professional";
import SpaceDashboard from "./pages/dashboard/Space";
import AdminDashboard from "./pages/dashboard/Admin";
import ProfessionalReports from "./pages/reports/Professional";
import SpaceReports from "./pages/reports/Space";
import { ProtectedRoute } from "./components/ProtectedRoute";
import './api/worker';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/availability" element={<Availability />} />
          <Route path="/checkout/:bookingId" element={<Checkout />} />
          <Route path="/success/:bookingId" element={<Success />} />
          <Route path="/r/:token" element={<RescheduleToken />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard/professional" element={
            <ProtectedRoute requireRole={['professional', 'space_admin', 'master_admin']}>
              <ProfessionalDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/space" element={
            <ProtectedRoute requireRole={['space_admin', 'master_admin']}>
              <SpaceDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/admin" element={
            <ProtectedRoute requireRole="master_admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          {/* Reports Routes */}
          <Route path="/reports/professional/:id" element={
            <ProtectedRoute requireRole={['professional', 'space_admin', 'master_admin']}>
              <ProfessionalReports />
            </ProtectedRoute>
          } />
          <Route path="/reports/space/:id" element={
            <ProtectedRoute requireRole={['space_admin', 'master_admin']}>
              <SpaceReports />
            </ProtectedRoute>
          } />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
