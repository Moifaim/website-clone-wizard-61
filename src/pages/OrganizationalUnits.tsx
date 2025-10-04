import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, Plus, Building2 } from "lucide-react";
import { OrgUnitForm } from "@/components/org-units/OrgUnitForm";

const OrganizationalUnits = () => {
  const [units, setUnits] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        loadUnits();
      }
    });
  }, [navigate]);

  const loadUnits = async () => {
    const { data } = await supabase
      .from("organizational_units")
      .select("*")
      .order("name", { ascending: true });
    
    if (data) setUnits(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Organizational Units</h1>
            <p className="text-muted-foreground mt-1">Gérez votre structure organisationnelle</p>
          </div>
          <Button className="bg-brand-600 hover:bg-brand-700" onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle unité
          </Button>
        </div>

        <div className="bg-gradient-to-br from-brand-50 to-white border rounded-xl p-5 shadow-soft mb-8 w-fit">
          <div className="flex items-center gap-3">
            <Building2 className="h-10 w-10 text-brand-600 opacity-50" />
            <div>
              <p className="text-sm text-muted-foreground">Total Unités</p>
              <p className="text-3xl font-bold">{units.length}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {units.map((unit) => (
            <Card key={unit.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Network className="h-5 w-5 text-primary mt-1" />
                  <div className="flex-1">
                    <CardTitle className="text-lg">{unit.name}</CardTitle>
                    {unit.code && (
                      <p className="text-sm text-muted-foreground mt-1">Code: {unit.code}</p>
                    )}
                  </div>
                </div>
              </CardHeader>
              {unit.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">{unit.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <OrgUnitForm open={showForm} onOpenChange={setShowForm} onSuccess={loadUnits} />
      </div>
    </div>
  );
};

export default OrganizationalUnits;