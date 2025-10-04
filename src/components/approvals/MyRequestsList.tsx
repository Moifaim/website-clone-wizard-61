import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const mockRequests = [
  {
    id: "REQ-0241",
    training: "Kubernetes Administration (CKA)",
    domain: "DevOps",
    dates: "12–14 Nov 2025",
    budget: "1 800 €",
    status: "pending" as const,
  },
  {
    id: "REQ-0227",
    training: "Sécurité Réseau niveau avancé",
    domain: "Cybersécurité",
    dates: "3–5 Oct 2025",
    budget: "1 300 €",
    status: "approved" as const,
  },
  {
    id: "REQ-0212",
    training: "AWS Solutions Architect Associate",
    domain: "Cloud",
    dates: "15–18 Sep 2025",
    budget: "1 950 €",
    status: "rejected" as const,
  },
];

const statusConfig = {
  pending: { label: "En attente", className: "bg-amber-100 text-amber-700 border-amber-200" },
  approved: { label: "Validée", className: "bg-green-100 text-green-700 border-green-200" },
  rejected: { label: "Refusée", className: "bg-red-100 text-red-700 border-red-200" },
};

export function MyRequestsList() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [domainFilter, setDomainFilter] = useState("all");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Filtrer :</span>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="approved">Validée</SelectItem>
            <SelectItem value="rejected">Refusée</SelectItem>
          </SelectContent>
        </Select>
        <Select value={domainFilter} onValueChange={setDomainFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous domaines</SelectItem>
            <SelectItem value="cyber">Cybersécurité</SelectItem>
            <SelectItem value="cloud">Cloud</SelectItem>
            <SelectItem value="devops">DevOps</SelectItem>
            <SelectItem value="dev">Développement</SelectItem>
            <SelectItem value="network">Réseaux</SelectItem>
            <SelectItem value="data">Data/IA</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="ml-auto">
          Exporter CSV
        </Button>
      </div>

      <div className="overflow-auto bg-card border rounded-2xl shadow-soft">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>#</TableHead>
              <TableHead>Formation</TableHead>
              <TableHead>Domaine</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockRequests.map((request) => (
              <TableRow key={request.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">{request.id}</TableCell>
                <TableCell>{request.training}</TableCell>
                <TableCell>{request.domain}</TableCell>
                <TableCell>{request.dates}</TableCell>
                <TableCell>{request.budget}</TableCell>
                <TableCell>
                  <Badge className={`${statusConfig[request.status].className} border`}>
                    {statusConfig[request.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {request.status === "pending" ? (
                      <>
                        <Button size="sm" variant="outline">Modifier</Button>
                        <Button size="sm" variant="outline">Annuler</Button>
                      </>
                    ) : (
                      <Button size="sm" variant="outline">Voir</Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
