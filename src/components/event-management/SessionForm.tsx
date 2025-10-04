import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SessionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function SessionForm({ open, onOpenChange, onSuccess }: SessionFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [trainings, setTrainings] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    training_id: "",
    start_date: "",
    end_date: "",
    location: "",
    instructor: "",
    max_participants: "",
    status: "scheduled",
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

    const { error } = await supabase.from("training_sessions").insert({
      ...formData,
      max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
    });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la session",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Session créée ✅",
        description: "La session a été ajoutée avec succès",
      });
      onSuccess();
      onOpenChange(false);
      setFormData({
        training_id: "",
        start_date: "",
        end_date: "",
        location: "",
        instructor: "",
        max_participants: "",
        status: "scheduled",
      });
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouvelle session de formation</DialogTitle>
          <DialogDescription>
            Planifiez une nouvelle session de formation
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                type="datetime-local"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="end">Date de fin *</Label>
              <Input
                id="end"
                type="datetime-local"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Lieu</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ex. Paris, En ligne"
              />
            </div>

            <div>
              <Label htmlFor="max">Participants max</Label>
              <Input
                id="max"
                type="number"
                min="1"
                value={formData.max_participants}
                onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
                placeholder="20"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="instructor">Formateur</Label>
            <Input
              id="instructor"
              value={formData.instructor}
              onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
              placeholder="Nom du formateur"
            />
          </div>

          <div>
            <Label htmlFor="status">Statut</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Planifiée</SelectItem>
                <SelectItem value="in_progress">En cours</SelectItem>
                <SelectItem value="completed">Terminée</SelectItem>
                <SelectItem value="cancelled">Annulée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="bg-brand-600 hover:bg-brand-700">
              {loading ? "Création..." : "Créer la session"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
