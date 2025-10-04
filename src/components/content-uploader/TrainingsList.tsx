import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, DollarSign, Clock } from "lucide-react";

interface Training {
  id: string;
  title: string;
  category?: string;
  provider?: string;
  cost?: number;
  duration_hours?: number;
  status: string;
  description?: string;
}

interface TrainingsListProps {
  trainings: Training[];
  onEdit: (training: Training) => void;
  onDelete: (id: string) => void;
}

export function TrainingsList({ trainings, onEdit, onDelete }: TrainingsListProps) {
  if (trainings.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Aucune formation disponible</p>
        <p className="text-sm mt-2">Créez votre première formation pour commencer</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {trainings.map((training) => (
        <Card key={training.id} className="hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <div className="flex justify-between items-start gap-2">
              <CardTitle className="text-lg line-clamp-2">{training.title}</CardTitle>
              <Badge className={training.status === "active" ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-700 border-gray-200"}>
                {training.status === "active" ? "Actif" : "Inactif"}
              </Badge>
            </div>
            {training.category && (
              <Badge variant="outline" className="mt-2 w-fit">
                {training.category}
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {training.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {training.description}
              </p>
            )}
            
            {training.provider && (
              <p className="text-sm">
                <span className="font-medium">Organisme:</span> {training.provider}
              </p>
            )}

            <div className="flex gap-4 text-sm text-muted-foreground">
              {training.cost && (
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(training.cost)}
                </div>
              )}
              {training.duration_hours && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {training.duration_hours}h
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => onEdit(training)}
              >
                <Pencil className="h-4 w-4 mr-1" />
                Éditer
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => onDelete(training.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
