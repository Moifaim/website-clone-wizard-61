import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, XCircle, UserPlus, Paperclip, MessageSquare } from "lucide-react";
import type { Request, RequestStatus } from "@/pages/ApprovalsRequests";
import { ApproveDialog } from "./ApproveDialog";
import { RejectDialog } from "./RejectDialog";
import { DelegateDialog } from "./DelegateDialog";
import { RequestTimeline } from "./RequestTimeline";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface RequestDetailsSheetProps {
  request: Request | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (requestId: string, comment?: string) => Promise<void>;
  onReject: (requestId: string, comment: string) => Promise<void>;
  onDelegate: (requestId: string, delegateToId: string) => Promise<void>;
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

export function RequestDetailsSheet({
  request,
  open,
  onOpenChange,
  onApprove,
  onReject,
  onDelegate,
  userRoles,
}: RequestDetailsSheetProps) {
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [delegateOpen, setDelegateOpen] = useState(false);

  if (!request) return null;

  const canApprove = userRoles.some(role => ["manager", "hr_admin", "super_admin"].includes(role)) && 
                     request.status === "in_review";

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "??";
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
          <SheetHeader>
            <div className="flex items-start justify-between">
              <div>
                <SheetTitle className="text-xl">
                  Demande #{request.id.slice(0, 8)}
                </SheetTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={statusConfig[request.status].className}>
                    {statusConfig[request.status].label}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(request.created_at), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </SheetHeader>

          <Separator className="my-6" />

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Détails</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="attachments">Pièces jointes</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6 mt-6">
              {/* Requester Info */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Demandeur</h3>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {getInitials(request.profiles?.first_name, request.profiles?.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {request.profiles?.first_name} {request.profiles?.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {request.profiles?.email}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Training Info */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Formation</h3>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-muted-foreground">Titre</div>
                    <div className="font-medium">{request.trainings?.title}</div>
                  </div>
                  {request.trainings?.category && (
                    <div>
                      <div className="text-sm text-muted-foreground">Catégorie</div>
                      <div>{request.trainings.category}</div>
                    </div>
                  )}
                  {request.trainings?.cost && (
                    <div>
                      <div className="text-sm text-muted-foreground">Coût</div>
                      <div className="font-medium">
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        }).format(Number(request.trainings.cost))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Justification */}
              {request.justification && (
                <>
                  <div>
                    <h3 className="text-sm font-semibold mb-3">Justification</h3>
                    <p className="text-sm text-muted-foreground">{request.justification}</p>
                  </div>
                  <Separator />
                </>
              )}

              {/* Approval Steps */}
              {request.approval_steps && request.approval_steps.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3">Étapes d'approbation</h3>
                  <div className="space-y-3">
                    {request.approval_steps.map((step) => (
                      <div key={step.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-sm">Étape {step.step_order}</div>
                          {step.comments && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {step.comments}
                            </div>
                          )}
                        </div>
                        <Badge
                          className={
                            step.status === "approved"
                              ? "bg-emerald-500"
                              : step.status === "rejected"
                              ? "bg-rose-500"
                              : "bg-amber-500"
                          }
                        >
                          {step.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="timeline" className="mt-6">
              <RequestTimeline request={request} />
            </TabsContent>

            <TabsContent value="attachments" className="mt-6">
              <div className="text-center py-8 text-muted-foreground">
                <Paperclip className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Aucune pièce jointe</p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          {canApprove && (
            <>
              <Separator className="my-6" />
              <div className="flex gap-3">
                <Button
                  onClick={() => setApproveOpen(true)}
                  className="flex-1"
                  variant="default"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approuver
                </Button>
                <Button
                  onClick={() => setRejectOpen(true)}
                  className="flex-1"
                  variant="destructive"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Rejeter
                </Button>
                <Button
                  onClick={() => setDelegateOpen(true)}
                  variant="outline"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Déléguer
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <ApproveDialog
        open={approveOpen}
        onOpenChange={setApproveOpen}
        onConfirm={async (comment) => {
          await onApprove(request.id, comment);
          setApproveOpen(false);
        }}
      />

      <RejectDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        onConfirm={async (comment) => {
          await onReject(request.id, comment);
          setRejectOpen(false);
        }}
      />

      <DelegateDialog
        open={delegateOpen}
        onOpenChange={setDelegateOpen}
        onConfirm={async (userId) => {
          await onDelegate(request.id, userId);
          setDelegateOpen(false);
        }}
      />
    </>
  );
}
