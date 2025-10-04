import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Lock, Globe } from "lucide-react";
import { CohortForm } from "@/components/cohorts/CohortForm";
import { CommunityForm } from "@/components/cohorts/CommunityForm";

const CohortsCommunities = () => {
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [communities, setCommunities] = useState<any[]>([]);
  const [showCohortForm, setShowCohortForm] = useState(false);
  const [showCommunityForm, setShowCommunityForm] = useState(false);
  const [activeTab, setActiveTab] = useState("cohorts");
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        loadData();
      }
    });
  }, [navigate]);

  const loadData = async () => {
    const { data: cohortsData } = await supabase
      .from("cohorts")
      .select("*")
      .order("created_at", { ascending: false });
    
    const { data: communitiesData } = await supabase
      .from("communities")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (cohortsData) setCohorts(cohortsData);
    if (communitiesData) setCommunities(communitiesData);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Cohorts & Communities</h1>
            <p className="text-muted-foreground mt-1">
              Organisez vos apprenants en cohortes et créez des communautés de pratique
            </p>
          </div>
          <Button
            className="bg-brand-600 hover:bg-brand-700"
            onClick={() => activeTab === "cohorts" ? setShowCohortForm(true) : setShowCommunityForm(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Créer {activeTab === "cohorts" ? "une cohorte" : "une communauté"}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-br from-brand-50 to-white border rounded-xl p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cohortes</p>
                <p className="text-3xl font-bold mt-1">{cohorts.length}</p>
              </div>
              <Users className="h-10 w-10 text-brand-600 opacity-50" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-white border rounded-xl p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Communautés</p>
                <p className="text-3xl font-bold mt-1">{communities.length}</p>
              </div>
              <Users className="h-10 w-10 text-purple-600 opacity-50" />
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="cohorts">Cohortes ({cohorts.length})</TabsTrigger>
            <TabsTrigger value="communities">Communautés ({communities.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cohorts" className="space-y-4 mt-6">
            {cohorts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cohorts.map((cohort) => (
                  <Card key={cohort.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle>{cohort.name}</CardTitle>
                          {cohort.description && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {cohort.description}
                            </p>
                          )}
                        </div>
                        <Users className="h-5 w-5 text-brand-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      {(cohort.start_date || cohort.end_date) && (
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                          {cohort.start_date && (
                            <Badge variant="outline">
                              Début: {new Date(cohort.start_date).toLocaleDateString("fr-FR")}
                            </Badge>
                          )}
                          {cohort.end_date && (
                            <Badge variant="outline">
                              Fin: {new Date(cohort.end_date).toLocaleDateString("fr-FR")}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Aucune cohorte créée</p>
                <p className="text-sm mt-2">Créez votre première cohorte pour commencer</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="communities" className="space-y-4 mt-6">
            {communities.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {communities.map((community) => (
                  <Card key={community.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle>{community.name}</CardTitle>
                            {community.is_private ? (
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Globe className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          {community.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {community.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Badge variant={community.is_private ? "secondary" : "outline"}>
                        {community.is_private ? "Privée" : "Publique"}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Aucune communauté créée</p>
                <p className="text-sm mt-2">Créez votre première communauté pour commencer</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <CohortForm
          open={showCohortForm}
          onOpenChange={setShowCohortForm}
          onSuccess={loadData}
        />

        <CommunityForm
          open={showCommunityForm}
          onOpenChange={setShowCommunityForm}
          onSuccess={loadData}
        />
      </div>
    </div>
  );
};

export default CohortsCommunities;