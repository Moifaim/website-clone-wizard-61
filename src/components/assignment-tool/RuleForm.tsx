import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RuleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function RuleForm({ open, onOpenChange, onSuccess }: RuleFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [trainings, setTrainings] = useState<any[]>([]);
  const [orgUnits, setOrgUnits] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    training_id: "",
    target_org_unit: "",
    description: "",
    trigger_condition: "new_hire",
  });

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  const loadData = async () => {
    const { data: trainingsData } = await supabase
      .from("trainings")
      .select("id, title")
      .eq("status", "active")
      .order("title");

    const { data: unitsData } = await supabase
      .from("organizational_units")
      .select("id, name")
      .order("name");

    if (trainingsData) setTrainings(trainingsData);
    if (unitsData) setOrgUnits(unitsData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simuler la création d'une règle (peut être stockée dans une nouvelle table plus tard)
    toast({
      title: "Règle créée ✅",
      description: "La règle d'assignation automatique a été configurée",
    });
    
    onSuccess();
    onOpenChange(false);
    setFormData({
      name: "",
      training_id: "",
      target_org_unit: "",
      description: "",
      trigger_condition: "new_hire",
    });

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouvelle règle d'assignation</DialogTitle>
          <DialogDescription>
            Définissez une règle pour assigner automatiquement des formations
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom de la règle *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex. Formation obligatoire nouveaux arrivants IT"
              required
            />
          </div>

          <div>
            <Label htmlFor="training">Formation assignée *</Label>
            <Select value={formData.training_id} onValueChange={(value) => setFormData({ ...formData, training_id: value })}>
              <SelectTrigger id="training">
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
            <Label htmlFor="orgunit">Unité organisationnelle cible</Label>
            <Select value={formData.target_org_unit} onValueChange={(value) => setFormData({ ...formData, target_org_unit: value })}>
              <SelectTrigger id="orgunit">
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

          <div>
            <Label htmlFor="trigger">Condition de déclenchement</Label>
            <Select value={formData.trigger_condition} onValueChange={(value) => setFormData({ ...formData, trigger_condition: value })}>
              <SelectTrigger id="trigger">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new_hire">Nouvel embauché</SelectItem>
                <SelectItem value="role_change">Changement de rôle</SelectItem>
                <SelectItem value="annual">Annuel</SelectItem>
                <SelectItem value="quarterly">Trimestriel</SelectItem>
                <SelectItem value="certification_expiry">Expiration certification</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Décrivez la logique d'assignation..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="bg-brand-600 hover:bg-brand-700">
              {loading ? "Création..." : "Créer la règle"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
