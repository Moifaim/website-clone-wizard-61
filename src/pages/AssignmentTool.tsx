import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Users, Tag, Sparkles, BarChart3, Settings } from "lucide-react";
import { RuleForm } from "@/components/assignment-tool/RuleForm";
import { CampaignForm } from "@/components/assignment-tool/CampaignForm";
import { SimulationDialog } from "@/components/assignment-tool/SimulationDialog";

const AssignmentTool = () => {
  const navigate = useNavigate();
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [showSimulation, setShowSimulation] = useState(false);
  const [stats, setStats] = useState({
    activeRules: 5,
    activeCampaigns: 2,
    assignmentsThisMonth: 48,
  });

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
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Assignment Tool</h1>
          <p className="text-muted-foreground mt-1">
            Automatisez l'assignation de formations avec des règles intelligentes
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-brand-50 to-white border rounded-xl p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Règles actives</p>
                <p className="text-3xl font-bold mt-1">{stats.activeRules}</p>
              </div>
              <Settings className="h-10 w-10 text-brand-600 opacity-50" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-white border rounded-xl p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Campagnes actives</p>
                <p className="text-3xl font-bold mt-1">{stats.activeCampaigns}</p>
              </div>
              <Users className="h-10 w-10 text-purple-600 opacity-50" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-white border rounded-xl p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Assignations ce mois</p>
                <p className="text-3xl font-bold mt-1">{stats.assignmentsThisMonth}</p>
              </div>
              <BarChart3 className="h-10 w-10 text-green-600 opacity-50" />
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-all duration-200 border-2 hover:border-brand-200">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-brand-100 rounded-xl">
                  <Target className="h-6 w-6 text-brand-600" />
                </div>
                <Sparkles className="h-5 w-5 text-brand-600 animate-pulse" />
              </div>
              <CardTitle>Règles d'assignation</CardTitle>
              <CardDescription className="min-h-[48px]">
                Définissez des règles automatiques d'assignation de formations basées sur les rôles, départements, ou événements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full bg-brand-600 hover:bg-brand-700"
                onClick={() => setShowRuleForm(true)}
              >
                <Target className="mr-2 h-4 w-4" />
                Créer une règle
              </Button>
              <div className="text-xs text-muted-foreground text-center">
                {stats.activeRules} règles configurées
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 border-2 hover:border-purple-200">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <Sparkles className="h-5 w-5 text-purple-600 animate-pulse" />
              </div>
              <CardTitle>Campagnes</CardTitle>
              <CardDescription className="min-h-[48px]">
                Lancez des campagnes de formation massives avec suivi en temps réel et notifications automatiques
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => setShowCampaignForm(true)}
              >
                <Users className="mr-2 h-4 w-4" />
                Nouvelle campagne
              </Button>
              <div className="text-xs text-muted-foreground text-center">
                {stats.activeCampaigns} campagnes en cours
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 border-2 hover:border-green-200">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Tag className="h-6 w-6 text-green-600" />
                </div>
                <Sparkles className="h-5 w-5 text-green-600 animate-pulse" />
              </div>
              <CardTitle>Simulation</CardTitle>
              <CardDescription className="min-h-[48px]">
                Simulez l'impact d'une assignation avant déploiement: coûts, participants, et taux de complétion
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setShowSimulation(true)}
              >
                <Tag className="mr-2 h-4 w-4" />
                Lancer simulation
              </Button>
              <div className="text-xs text-muted-foreground text-center">
                Prévisualisation sans impact
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-gradient-to-br from-brand-50 to-white border rounded-2xl p-6 shadow-soft">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand-600" />
            Comment ça marche ?
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground mb-1">1. Créez des règles</p>
              <p>Définissez des conditions automatiques d'assignation (nouveaux arrivants, changement de rôle, etc.)</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">2. Lancez des campagnes</p>
              <p>Assignez massivement des formations à des groupes cibles avec suivi en temps réel</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">3. Simulez l'impact</p>
              <p>Évaluez les coûts, le nombre de participants et les résultats avant déploiement</p>
            </div>
          </div>
        </div>

        <RuleForm
          open={showRuleForm}
          onOpenChange={setShowRuleForm}
          onSuccess={() => setStats({ ...stats, activeRules: stats.activeRules + 1 })}
        />

        <CampaignForm
          open={showCampaignForm}
          onOpenChange={setShowCampaignForm}
          onSuccess={() => setStats({ ...stats, activeCampaigns: stats.activeCampaigns + 1 })}
        />

        <SimulationDialog
          open={showSimulation}
          onOpenChange={setShowSimulation}
        />
      </div>
    </div>
  );
};

export default AssignmentTool;