import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users } from "lucide-react";

const CohortsCommunities = () => {
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [communities, setCommunities] = useState<any[]>([]);
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
          <h1 className="text-3xl font-bold">Cohorts & Communities</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Créer
          </Button>
        </div>

        <Tabs defaultValue="cohorts" className="w-full">
          <TabsList>
            <TabsTrigger value="cohorts">Cohortes</TabsTrigger>
            <TabsTrigger value="communities">Communautés</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cohorts" className="space-y-4 mt-6">
            {cohorts.map((cohort) => (
              <Card key={cohort.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{cohort.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {cohort.description}
                      </p>
                    </div>
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    {cohort.start_date && (
                      <span>Début: {new Date(cohort.start_date).toLocaleDateString()}</span>
                    )}
                    {cohort.end_date && (
                      <span>Fin: {new Date(cohort.end_date).toLocaleDateString()}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="communities" className="space-y-4 mt-6">
            {communities.map((community) => (
              <Card key={community.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{community.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {community.description}
                      </p>
                    </div>
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CohortsCommunities;