import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search } from "lucide-react";
import type { RequestStatus } from "@/types/approvals";

interface RequestFiltersProps {
  statusFilter: RequestStatus[];
  onStatusFilterChange: (statuses: RequestStatus[]) => void;
  queueFilter: "my" | "team" | "all";
  onQueueFilterChange: (queue: "my" | "team" | "all") => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

const statusConfig: Record<RequestStatus, { label: string; variant: string }> = {
  draft: { label: "Brouillon", variant: "bg-zinc-500" },
  submitted: { label: "Soumis", variant: "bg-blue-500" },
  in_review: { label: "En révision", variant: "bg-amber-500" },
  approved: { label: "Approuvé", variant: "bg-emerald-500" },
  rejected: { label: "Rejeté", variant: "bg-rose-500" },
  scheduled: { label: "Planifié", variant: "bg-indigo-500" },
  completed: { label: "Complété", variant: "bg-gray-500" },
};

export function RequestFilters({
  statusFilter,
  onStatusFilterChange,
  queueFilter,
  onQueueFilterChange,
  searchQuery,
  onSearchQueryChange,
}: RequestFiltersProps) {
  const toggleStatus = (status: RequestStatus) => {
    if (statusFilter.includes(status)) {
      onStatusFilterChange(statusFilter.filter(s => s !== status));
    } else {
      onStatusFilterChange([...statusFilter, status]);
    }
  };

  return (
    <div className="w-80 border-r bg-card p-6 overflow-auto">
      <h2 className="text-xl font-bold mb-6">Filtres</h2>

      {/* Search */}
      <div className="mb-6">
        <Label htmlFor="search" className="mb-2 block">Recherche</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Queue Filter */}
      <div className="mb-6">
        <Label className="mb-3 block">File d'attente</Label>
        <RadioGroup value={queueFilter} onValueChange={(v) => onQueueFilterChange(v as "my" | "team" | "all")}>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="my" id="my" />
            <Label htmlFor="my" className="cursor-pointer font-normal">Mes demandes</Label>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="team" id="team" />
            <Label htmlFor="team" className="cursor-pointer font-normal">Mon équipe</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all" className="cursor-pointer font-normal">Toutes</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Status Filter */}
      <div className="mb-6">
        <Label className="mb-3 block">Statut</Label>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(statusConfig) as [RequestStatus, typeof statusConfig[RequestStatus]][]).map(([status, config]) => (
            <Badge
              key={status}
              className={`cursor-pointer transition-opacity ${
                statusFilter.includes(status) ? config.variant : "opacity-50"
              }`}
              onClick={() => toggleStatus(status)}
            >
              {config.label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
