import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { RequestFilters } from "@/components/approvals/RequestFilters";
import { RequestsTable } from "@/components/approvals/RequestsTable";
import { RequestDetailsSheet } from "@/components/approvals/RequestDetailsSheet";
import { useToast } from "@/hooks/use-toast";

export type RequestStatus = "draft" | "submitted" | "in_review" | "approved" | "rejected" | "scheduled" | "completed";

export interface Request {
  id: string;
  user_id: string;
  training_id: string;
  session_id?: string;
  status: RequestStatus;
  justification?: string;
  submitted_at?: string;
  created_at: string;
  updated_at: string;
  trainings?: {
    title: string;
    cost?: number;
    category?: string;
  };
  profiles?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
  approval_steps?: Array<{
    id: string;
    step_order: number;
    status: string;
    approver_id?: string;
    approved_at?: string;
    comments?: string;
  }>;
}

const ApprovalsRequests = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [user, setUser] = useState<any>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Filters state
  const [statusFilter, setStatusFilter] = useState<RequestStatus[]>([]);
  const [queueFilter, setQueueFilter] = useState<"my" | "team" | "all">("my");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        loadUserRoles(session.user.id);
        loadRequests();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        loadUserRoles(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Apply URL filters
  useEffect(() => {
    const status = searchParams.get("status");
    const queue = searchParams.get("queue");
    
    if (status) setStatusFilter([status as RequestStatus]);
    if (queue) setQueueFilter(queue as "my" | "team" | "all");
  }, [searchParams]);

  const loadUserRoles = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    
    if (data) {
      setUserRoles(data.map(r => r.role));
    }
  };

  const loadRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("requests")
      .select(`
        *,
        trainings(title, cost, category),
        profiles(first_name, last_name, email),
        approval_steps(id, step_order, status, approver_id, approved_at, comments)
      `)
      .order("created_at", { ascending: false });
    
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les demandes",
        variant: "destructive",
      });
    } else if (data) {
      setRequests(data as Request[]);
      setFilteredRequests(data as Request[]);
    }
    setLoading(false);
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...requests];

    // Queue filter
    if (queueFilter === "my" && user) {
      filtered = filtered.filter(r => r.user_id === user.id);
    }

    // Status filter
    if (statusFilter.length > 0) {
      filtered = filtered.filter(r => statusFilter.includes(r.status));
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.trainings?.title.toLowerCase().includes(query) ||
        r.profiles?.first_name?.toLowerCase().includes(query) ||
        r.profiles?.last_name?.toLowerCase().includes(query) ||
        r.profiles?.email?.toLowerCase().includes(query)
      );
    }

    setFilteredRequests(filtered);
  }, [requests, queueFilter, statusFilter, searchQuery, user]);

  const handleRequestClick = (request: Request) => {
    setSelectedRequest(request);
  };

  const handleApprove = async (requestId: string, comment?: string) => {
    // Implementation will be in RequestDetailsSheet
    await loadRequests();
    setSelectedRequest(null);
    toast({
      title: "Demande approuvée",
      description: "La demande a été approuvée avec succès",
    });
  };

  const handleReject = async (requestId: string, comment: string) => {
    // Implementation will be in RequestDetailsSheet
    await loadRequests();
    setSelectedRequest(null);
    toast({
      title: "Demande rejetée",
      description: "La demande a été rejetée",
      variant: "destructive",
    });
  };

  const handleDelegate = async (requestId: string, delegateToId: string) => {
    // Implementation will be in RequestDetailsSheet
    await loadRequests();
    toast({
      title: "Demande déléguée",
      description: "La demande a été déléguée avec succès",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Panel - Filters */}
        <RequestFilters
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          queueFilter={queueFilter}
          onQueueFilterChange={setQueueFilter}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
        />

        {/* Center Panel - Table */}
        <div className="flex-1 overflow-auto">
          <RequestsTable
            requests={filteredRequests}
            loading={loading}
            onRequestClick={handleRequestClick}
            userRoles={userRoles}
          />
        </div>

        {/* Right Panel - Details Sheet */}
        <RequestDetailsSheet
          request={selectedRequest}
          open={!!selectedRequest}
          onOpenChange={(open) => !open && setSelectedRequest(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelegate={handleDelegate}
          userRoles={userRoles}
        />
      </div>
    </div>
  );
};

export default ApprovalsRequests;
