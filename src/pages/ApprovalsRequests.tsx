import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import { SubmitRequestForm } from "@/components/approvals/SubmitRequestForm";
import { MyRequestsList } from "@/components/approvals/MyRequestsList";
import { ManagerApprovals } from "@/components/approvals/ManagerApprovals";
import { StatsPanel } from "@/components/approvals/StatsPanel";

type Tab = "submit" | "my" | "manager" | "stats";

const ApprovalsRequests = () => {
  const [activeTab, setActiveTab] = useState<Tab>("submit");
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const tabs = [
    { id: "submit" as const, label: "Soumettre" },
    { id: "my" as const, label: "Mes demandes" },
    { id: "manager" as const, label: "Approbations (manager)" },
    { id: "stats" as const, label: "Statistiques" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Topbar */}
      <header className="sticky top-16 z-30 backdrop-blur bg-card/80 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-soft">
              <GraduationCap className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-lg font-semibold leading-tight">Approvals & Requests — Formations IT</h1>
              <p className="text-xs text-muted-foreground">
                Soumettez, suivez et approuvez les demandes de formations (Cybersécurité, Cloud, DevOps, Réseau, etc.).
              </p>
            </div>
          </div>
          <div className="ml-auto">
            <Button 
              className="bg-brand-600 hover:bg-brand-700 shadow-soft hidden sm:inline-flex"
              onClick={() => setActiveTab("submit")}
            >
              + Nouvelle demande
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              variant={activeTab === tab.id ? "default" : "outline"}
              className={activeTab === tab.id ? "bg-slate-900 text-white hover:bg-slate-800" : ""}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab panels */}
        <div>
          {activeTab === "submit" && <SubmitRequestForm />}
          {activeTab === "my" && <MyRequestsList />}
          {activeTab === "manager" && <ManagerApprovals />}
          {activeTab === "stats" && <StatsPanel />}
        </div>
      </main>
    </div>
  );
};

export default ApprovalsRequests;
