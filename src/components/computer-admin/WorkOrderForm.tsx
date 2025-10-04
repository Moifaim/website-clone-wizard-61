import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WorkOrderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function WorkOrderForm({ open, onOpenChange, onSuccess }: WorkOrderFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    description: "",
    asset_id: "",
    status: "pending",
  });

  useEffect(() => {
    if (open) {
      loadAssets();
    }
  }, [open]);

  const loadAssets = async () => {
    const { data } = await supabase
      .from("computer_assets")
      .select("id, name, type")
      .order("name");

    if (data) setAssets(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("work_orders").insert({
      ...formData,
      asset_id: formData.asset_id || null,
      user_id: user?.id,
    });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le work order",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Work order créé ✅",
        description: "La demande a été créée avec succès",
      });
      onSuccess();
      onOpenChange(false);
      setFormData({
        description: "",
        asset_id: "",
        status: "pending",
      });
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Nouveau work order</DialogTitle>
          <DialogDescription>
            Créez une demande d'intervention IT
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Décrivez le problème ou la demande..."
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="asset">Asset concerné (optionnel)</Label>
            <Select value={formData.asset_id} onValueChange={(value) => setFormData({ ...formData, asset_id: value })}>
              <SelectTrigger id="asset">
                <SelectValue placeholder="Sélectionnez un asset" />
              </SelectTrigger>
              <SelectContent>
                {assets.map((asset) => (
                  <SelectItem key={asset.id} value={asset.id}>
                    {asset.name} ({asset.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="bg-brand-600 hover:bg-brand-700">
              {loading ? "Création..." : "Créer le work order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
