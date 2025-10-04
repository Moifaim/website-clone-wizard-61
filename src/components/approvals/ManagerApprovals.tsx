import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const mockApprovals = [
  {
    id: "REQ-0241",
    training: "Kubernetes Administration (CKA)",
    requester: "Lionel T.",
    domain: "DevOps",
    dates: "12–14 Nov 2025",
    budget: "1 800 €",
    justification: "Préparation migration clusters prod vers Kubernetes managé, amélioration du Time-to-Deploy.",
  },
  {
    id: "REQ-0242",
    training: "Sécurité Réseau niveau avancé",
    requester: "Sara B.",
    domain: "Cybersécurité",
    dates: "8–10 Dec 2025",
    budget: "1 300 €",
    justification: "Renforcement des compétences SOC, conformité ISO 27001 et réduction du MTTR.",
  },
];

export function ManagerApprovals() {
  const [filter, setFilter] = useState("pending");
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const { toast } = useToast();

  const handleApprove = () => {
    toast({
      title: "Demande approuvée ✅",
      description: "La demande a été validée avec succès.",
    });
  };

  const handleReject = () => {
    setShowRejectDialog(false);
    setRejectReason("");
    toast({
      title: "Demande refusée ❌",
      description: "Le demandeur sera notifié.",
      variant: "destructive",
    });
  };

  const handleSendInfo = () => {
    setShowInfoDialog(false);
    setInfoMessage("");
    toast({
      title: "Message envoyé ✉️",
      description: "Le demandeur recevra votre question.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Filtrer :</span>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="devops">DevOps</SelectItem>
            <SelectItem value="cyber">Cybersécurité</SelectItem>
            <SelectItem value="cloud">Cloud</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="ml-auto">
          Exporter PDF
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {mockApprovals.map((approval) => (
          <article key={approval.id} className="bg-card border rounded-2xl p-5 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-semibold">{approval.training}</h4>
                <p className="text-xs text-muted-foreground">
                  {approval.id} · Demandeur : {approval.requester} · {approval.domain}
                </p>
              </div>
              <Badge className="bg-amber-100 text-amber-700 border-amber-200 border">En attente</Badge>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Période</dt>
                <dd className="font-medium">{approval.dates}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Budget</dt>
                <dd className="font-medium">{approval.budget}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-muted-foreground">Justification</dt>
                <dd className="text-sm">{approval.justification}</dd>
              </div>
            </dl>
            <div className="mt-4 flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setShowInfoDialog(true)}>
                Infos sup.
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={handleApprove}>
                Approuver
              </Button>
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => setShowRejectDialog(true)}>
                Refuser
              </Button>
            </div>
          </article>
        ))}
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Raison du refus</DialogTitle>
            <DialogDescription>
              Expliquez brièvement la raison pour garder un historique clair.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor="rejectReason">Motif</Label>
            <Textarea
              id="rejectReason"
              rows={4}
              placeholder="Ex. Hors budget ce trimestre, re-proposer T+1…"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Annuler
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleReject}>
              Confirmer le refus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Info Dialog */}
      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Demander des informations</DialogTitle>
            <DialogDescription>
              Rédigez votre question. Le demandeur sera notifié.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor="infoMessage">Message</Label>
            <Textarea
              id="infoMessage"
              rows={4}
              placeholder="Ex. Peux-tu préciser les livrables et l'impact sur le run ?"
              value={infoMessage}
              onChange={(e) => setInfoMessage(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInfoDialog(false)}>
              Annuler
            </Button>
            <Button className="bg-brand-600 hover:bg-brand-700" onClick={handleSendInfo}>
              Envoyer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
