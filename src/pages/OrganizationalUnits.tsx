import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, Plus } from "lucide-react";

const OrganizationalUnits = () => {
  const [units, setUnits] = useState<any[]>([]);
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
          <h1 className="text-3xl font-bold">Organizational Units</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle unité
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {units.map((unit) => (
            <Card key={unit.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Network className="h-5 w-5 text-primary mt-1" />
                  <div className="flex-1">
                    <CardTitle className="text-lg">{unit.name}</CardTitle>
                    {unit.code && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Code: {unit.code}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              {unit.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {unit.description}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrganizationalUnits;