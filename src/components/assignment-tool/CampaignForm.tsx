import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CampaignFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CampaignForm({ open, onOpenChange, onSuccess }: CampaignFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [trainings, setTrainings] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    training_id: "",
    target_count: "",
    start_date: "",
    end_date: "",
    description: "",
  });

  useEffect(() => {
    if (open) {
      loadTrainings();
    }
  }, [open]);

  const loadTrainings = async () => {
    const { data } = await supabase
      .from("trainings")
      .select("id, title")
      .eq("status", "active")
      .order("title");

    if (data) setTrainings(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    toast({
      title: "Campagne lancée ✅",
      description: `Campagne "${formData.name}" créée avec succès`,
    });
    
    onSuccess();
    onOpenChange(false);
    setFormData({
      name: "",
      training_id: "",
      target_count: "",
      start_date: "",
      end_date: "",
      description: "",
    });

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouvelle campagne de formation</DialogTitle>
          <DialogDescription>
            Lancez une campagne d'assignation massive de formations
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom de la campagne *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex. Campagne Cybersécurité Q1 2025"
              required
            />
          </div>

          <div>
            <Label htmlFor="training">Formation *</Label>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start">Date de début *</Label>
              <Input
                id="start"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="end">Date de fin *</Label>
              <Input
                id="end"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="target">Nombre cible de participants</Label>
            <Input
              id="target"
              type="number"
              min="1"
              value={formData.target_count}
              onChange={(e) => setFormData({ ...formData, target_count: e.target.value })}
              placeholder="50"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Objectifs et détails de la campagne..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="bg-brand-600 hover:bg-brand-700">
              {loading ? "Lancement..." : "Lancer la campagne"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
