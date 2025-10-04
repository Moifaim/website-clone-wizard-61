import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, CheckCircle, XCircle, Send, FileText } from "lucide-react";
import type { Request } from "@/types/approvals";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface RequestTimelineProps {
  request: Request;
}

interface TimelineEvent {
  id: string;
  type: "created" | "submitted" | "comment" | "approved" | "rejected" | "status_change";
  date: string;
  user?: {
    first_name?: string;
    last_name?: string;
  };
  content?: string;
  status?: string;
}

export function RequestTimeline({ request }: RequestTimelineProps) {
  // Build timeline from request data
  const events: TimelineEvent[] = [
    {
      id: "created",
      type: "created",
      date: request.created_at,
      user: request.profiles,
      content: "Demande créée",
    },
  ];

  if (request.submitted_at) {
    events.push({
      id: "submitted",
      type: "submitted",
      date: request.submitted_at,
      user: request.profiles,
      content: "Demande soumise pour approbation",
    });
  }

  // Add approval steps as events
  request.approval_steps?.forEach((step) => {
    if (step.approved_at) {
      events.push({
        id: step.id,
        type: step.status === "approved" ? "approved" : "rejected",
        date: step.approved_at,
        content: step.comments || `Étape ${step.step_order} ${step.status}`,
        status: step.status,
      });
    }
  });

  // Sort by date
  events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "created":
      case "submitted":
        return <FileText className="h-4 w-4" />;
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "comment":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Send className="h-4 w-4" />;
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "??";
  };

  return (
    <div className="space-y-6">
      {events.map((event, index) => (
        <div key={event.id} className="relative">
          {index < events.length - 1 && (
            <div className="absolute left-5 top-10 bottom-0 w-px bg-border" />
          )}
          
          <div className="flex gap-4">
            <Avatar className="h-10 w-10 border-2 border-background">
              <AvatarFallback>
                {event.user 
                  ? getInitials(event.user.first_name, event.user.last_name)
                  : getIcon(event.type)
                }
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">
                    {event.user 
                      ? `${event.user.first_name} ${event.user.last_name}`
                      : "Système"
                    }
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(event.date), "PPp", { locale: fr })}
                  </div>
                </div>
                {event.status && (
                  <Badge
                    className={
                      event.status === "approved"
                        ? "bg-emerald-500"
                        : event.status === "rejected"
                        ? "bg-rose-500"
                        : "bg-amber-500"
                    }
                  >
                    {event.status}
                  </Badge>
                )}
              </div>

              {event.content && (
                <div className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                  {event.content}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {events.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Aucune activité</p>
        </div>
      )}
    </div>
  );
}
