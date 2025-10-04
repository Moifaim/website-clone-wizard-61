import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ApprovalsRequests from "./pages/ApprovalsRequests";
import ContentUploader from "./pages/ContentUploader";
import ComputerAdmin from "./pages/ComputerAdmin";
import AssignmentTool from "./pages/AssignmentTool";
import EventManagement from "./pages/EventManagement";
import CohortsCommunities from "./pages/CohortsCommunities";
import OrganizationalUnits from "./pages/OrganizationalUnits";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/approvals-requests" element={<ApprovalsRequests />} />
          <Route path="/content-uploader" element={<ContentUploader />} />
          <Route path="/computer-admin" element={<ComputerAdmin />} />
          <Route path="/assignment-tool" element={<AssignmentTool />} />
          <Route path="/event-management" element={<EventManagement />} />
          <Route path="/cohorts-communities" element={<CohortsCommunities />} />
          <Route path="/organizational-units" element={<OrganizationalUnits />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
