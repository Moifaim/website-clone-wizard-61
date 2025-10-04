import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ApproveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (comment?: string) => Promise<void>;
}

export function ApproveDialog({ open, onOpenChange, onConfirm }: ApproveDialogProps) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(comment || undefined);
      setComment("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approuver la demande</DialogTitle>
          <DialogDescription>
            Vous êtes sur le point d'approuver cette demande. Vous pouvez ajouter un commentaire optionnel.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="approve-comment">Commentaire (optionnel)</Label>
            <Textarea
              id="approve-comment"
              placeholder="Ajouter un commentaire..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="mt-2"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleConfirm} disabled={loading}>
            {loading ? "Approbation..." : "Approuver"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
