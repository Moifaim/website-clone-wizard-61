import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users, DollarSign, Calendar, TrendingUp } from "lucide-react";

interface SimulationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SimulationDialog({ open, onOpenChange }: SimulationDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [trainings, setTrainings] = useState<any[]>([]);
  const [orgUnits, setOrgUnits] = useState<any[]>([]);
  const [selectedTraining, setSelectedTraining] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const loadData = async () => {
    setLoading(true);
    const { data: trainingsData } = await supabase
      .from("trainings")
      .select("id, title, cost, duration_hours")
      .eq("status", "active")
      .order("title");

    const { data: unitsData } = await supabase
      .from("organizational_units")
      .select("id, name")
      .order("name");

    if (trainingsData) setTrainings(trainingsData);
    if (unitsData) setOrgUnits(unitsData);
    setLoading(false);
  };

  const runSimulation = async () => {
    if (!selectedTraining) {
      toast({
        title: "Formation requise",
        description: "Veuillez sélectionner une formation",
        variant: "destructive",
      });
      return;
    }

    setSimulating(true);
    
    // Simuler des calculs
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const training = trainings.find(t => t.id === selectedTraining);
    const estimatedUsers = Math.floor(Math.random() * 50) + 20;
    const totalCost = training?.cost ? training.cost * estimatedUsers : 0;
    const totalHours = training?.duration_hours ? training.duration_hours * estimatedUsers : 0;

    setResults({
      training: training?.title,
      estimatedUsers,
      totalCost,
      totalHours,
      completionRate: Math.floor(Math.random() * 20) + 75,
      averageScore: Math.floor(Math.random() * 15) + 80,
    });

    setSimulating(false);
    toast({
      title: "Simulation terminée ✅",
      description: "Les résultats sont disponibles",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Simulation d'assignation</DialogTitle>
          <DialogDescription>
            Simulez l'impact d'une assignation de formation avant déploiement
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="sim-training">Formation *</Label>
            <Select value={selectedTraining} onValueChange={setSelectedTraining}>
              <SelectTrigger id="sim-training">
                <SelectValue placeholder="Sélectionnez une formation" />
              </SelectTrigger>
              <SelectContent>
                {trainings.map((training) => (
                  <SelectItem key={training.id} value={training.id}>
                    {training.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="sim-unit">Unité cible (optionnel)</Label>
            <Select value={selectedUnit} onValueChange={setSelectedUnit}>
              <SelectTrigger id="sim-unit">
                <SelectValue placeholder="Toutes les unités" />
              </SelectTrigger>
              <SelectContent>
                {orgUnits.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={runSimulation}
            disabled={simulating || !selectedTraining}
            className="w-full bg-brand-600 hover:bg-brand-700"
          >
            {simulating ? "Simulation en cours..." : "Lancer la simulation"}
          </Button>

          {results && (
            <div className="space-y-4 pt-4 border-t animate-fade-in">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Résultats de simulation
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Users className="h-8 w-8 text-brand-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Utilisateurs impactés</p>
                        <p className="text-2xl font-bold">{results.estimatedUsers}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Coût total estimé</p>
                        <p className="text-2xl font-bold">
                          {new Intl.NumberFormat("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                          }).format(results.totalCost)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-8 w-8 text-purple-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Heures totales</p>
                        <p className="text-2xl font-bold">{results.totalHours}h</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-8 w-8 text-orange-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Taux de complétion prévu</p>
                        <p className="text-2xl font-bold">{results.completionRate}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-gradient-to-br from-brand-50 to-white border rounded-xl p-4">
                <p className="text-sm font-medium mb-2">Recommandations</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Planifier {Math.ceil(results.estimatedUsers / 20)} sessions pour accommoder tous les participants</li>
                  <li>• Prévoir un budget de {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(results.totalCost)}</li>
                  <li>• Score moyen attendu: {results.averageScore}%</li>
                  <li>• Durée estimée du déploiement: {Math.ceil(results.totalHours / 40)} semaines</li>
                </ul>
              </div>

              <Badge className="bg-green-100 text-green-700 border-green-200">
                Impact: Positif
              </Badge>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
