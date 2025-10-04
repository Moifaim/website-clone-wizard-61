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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface RejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (comment: string) => Promise<void>;
}

export function RejectDialog({ open, onOpenChange, onConfirm }: RejectDialogProps) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    if (!comment.trim()) {
      setError("Un motif de rejet est requis");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await onConfirm(comment);
      setComment("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rejeter la demande</DialogTitle>
          <DialogDescription>
            Vous êtes sur le point de rejeter cette demande. Cette action mettra fin au workflow d'approbation.
          </DialogDescription>
        </DialogHeader>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Le rejet d'une demande est définitif et ne peut pas être annulé.
          </AlertDescription>
        </Alert>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="reject-comment">
              Motif du rejet <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reject-comment"
              placeholder="Expliquez pourquoi vous rejetez cette demande..."
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                setError("");
              }}
              rows={4}
              className="mt-2"
            />
            {error && <p className="text-sm text-destructive mt-2">{error}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={loading}>
            {loading ? "Rejet..." : "Rejeter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
