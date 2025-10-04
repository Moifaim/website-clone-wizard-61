import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Users, Tag } from "lucide-react";

const AssignmentTool = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Assignment Tool</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Target className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Règles d'assignation</CardTitle>
              <CardDescription>
                Définissez des règles automatiques d'assignation de formations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Créer une règle</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Campagnes</CardTitle>
              <CardDescription>
                Lancez des campagnes de formation automatiques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Nouvelle campagne</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Tag className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Simulation</CardTitle>
              <CardDescription>
                Simulez l'impact d'une assignation avant déploiement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">Lancer simulation</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssignmentTool;