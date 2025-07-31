import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import CoachingPlan from "./pages/CoachingPlan";
import Ebooks from "./pages/Ebooks";
import Sessions from "./pages/Sessions";
import SupplementGuidance from "./pages/SupplementGuidance";
import WorkoutLibrary from "./pages/WorkoutLibrary";
import Faq from "./pages/Faq";
import TermsConditions from "./pages/TermsConditions";
import Certificate from "./pages/Certificate";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Register from "./pages/Register";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="about-us" element={<About />} />
          <Route path="plans" element={<CoachingPlan />} />
          <Route path="e-books" element={<Ebooks />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="supplement-guidance" element={<SupplementGuidance />} />
          <Route path="workout-library" element={<WorkoutLibrary />} />
          <Route path="faqs" element={<Faq />} />
          <Route path="terms-and-conditions" element={<TermsConditions />} />
          <Route path="certificate" element={<Certificate />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
