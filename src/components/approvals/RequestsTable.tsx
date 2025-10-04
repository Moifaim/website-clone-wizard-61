import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import type { Request, RequestStatus } from "@/pages/ApprovalsRequests";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface RequestsTableProps {
  requests: Request[];
  loading: boolean;
  onRequestClick: (request: Request) => void;
  userRoles: string[];
}

const statusConfig: Record<RequestStatus, { label: string; className: string }> = {
  draft: { label: "Brouillon", className: "bg-zinc-500" },
  submitted: { label: "Soumis", className: "bg-blue-500" },
  in_review: { label: "En révision", className: "bg-amber-500" },
  approved: { label: "Approuvé", className: "bg-emerald-500" },
  rejected: { label: "Rejeté", className: "bg-rose-500" },
  scheduled: { label: "Planifié", className: "bg-indigo-500" },
  completed: { label: "Complété", className: "bg-gray-500" },
};

export function RequestsTable({ requests, loading, onRequestClick, userRoles }: RequestsTableProps) {
  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "??";
  };

  const getSLABadge = (request: Request) => {
    // Mock SLA calculation - in real app, calculate from approval_steps
    // For now, randomly assign days for demo purposes
    const daysRemaining = Math.floor(Math.random() * 5) - 1;
    
    if (daysRemaining < 0) {
      return <Badge className="bg-rose-500">Dépassé</Badge>;
    } else if (daysRemaining === 0) {
      return <Badge className="bg-red-500">J-0</Badge>;
    } else if (daysRemaining === 1) {
      return <Badge className="bg-orange-500">J-1</Badge>;
    } else {
      return <Badge className="bg-green-500">J-{daysRemaining}</Badge>;
    }
  };

  const canQuickApprove = (request: Request) => {
    return userRoles.some(role => ["manager", "hr_admin", "super_admin"].includes(role)) && 
           request.status === "in_review";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">Aucune demande trouvée</p>
          <p className="text-sm text-muted-foreground">Essayez de modifier vos filtres</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Demandes d'approbation</h1>
        <div className="text-sm text-muted-foreground">
          {requests.length} demande{requests.length > 1 ? "s" : ""}
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ref</TableHead>
              <TableHead>Demandeur</TableHead>
              <TableHead>Formation</TableHead>
              <TableHead>Coût</TableHead>
              <TableHead>SLA</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Dernière activité</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow
                key={request.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onRequestClick(request)}
              >
                <TableCell className="font-mono text-sm">
                  {request.id.slice(0, 8)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {getInitials(request.profiles?.first_name, request.profiles?.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">
                        {request.profiles?.first_name} {request.profiles?.last_name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {request.profiles?.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <div className="font-medium text-sm truncate">
                      {request.trainings?.title}
                    </div>
                    {request.trainings?.category && (
                      <div className="text-xs text-muted-foreground">
                        {request.trainings.category}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {request.trainings?.cost ? (
                    <span className="font-medium">
                      {new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      }).format(Number(request.trainings.cost))}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>{getSLABadge(request)}</TableCell>
                <TableCell>
                  <Badge className={statusConfig[request.status].className}>
                    {statusConfig[request.status].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(request.updated_at), {
                    addSuffix: true,
                    locale: fr,
                  })}
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  {canQuickApprove(request) && (
                    <TooltipProvider>
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Approuver (A)</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Rejeter (R)</TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
