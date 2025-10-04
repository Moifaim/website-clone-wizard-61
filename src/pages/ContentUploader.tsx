import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, BookOpen, Calendar, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TrainingForm } from "@/components/content-uploader/TrainingForm";
import { TrainingsList } from "@/components/content-uploader/TrainingsList";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ContentUploader = () => {
  const [user, setUser] = useState<any>(null);
  const [trainings, setTrainings] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [showTrainingForm, setShowTrainingForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        loadData();
      }
    });
  }, [navigate]);

  const loadData = async () => {
    const { data: trainingsData } = await supabase
      .from("trainings")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: sessionsData } = await supabase
      .from("training_sessions")
      .select("*, trainings(title)")
      .order("start_date", { ascending: false });

    if (trainingsData) setTrainings(trainingsData);
    if (sessionsData) setSessions(sessionsData);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const { error } = await supabase
      .from("trainings")
      .delete()
      .eq("id", deleteId);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la formation",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Formation supprimée",
        description: "La formation a été supprimée avec succès",
      });
      loadData();
    }
    setDeleteId(null);
  };

  const stats = {
    totalTrainings: trainings.length,
    activeTrainings: trainings.filter(t => t.status === "active").length,
    totalSessions: sessions.length,
    upcomingSessions: sessions.filter(s => new Date(s.start_date) > new Date()).length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Content Uploader</h1>
            <p className="text-muted-foreground mt-1">
              Gérez votre catalogue de formations et sessions
            </p>
          </div>
          <Button
            className="bg-brand-600 hover:bg-brand-700"
            onClick={() => setShowTrainingForm(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle formation
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-brand-50 to-white border rounded-xl p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Formations</p>
                <p className="text-3xl font-bold mt-1">{stats.totalTrainings}</p>
              </div>
              <BookOpen className="h-10 w-10 text-brand-600 opacity-50" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-white border rounded-xl p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Actives</p>
                <p className="text-3xl font-bold mt-1">{stats.activeTrainings}</p>
              </div>
              <BookOpen className="h-10 w-10 text-green-600 opacity-50" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-white border rounded-xl p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sessions</p>
                <p className="text-3xl font-bold mt-1">{stats.totalSessions}</p>
              </div>
              <Calendar className="h-10 w-10 text-purple-600 opacity-50" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-white border rounded-xl p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">À venir</p>
                <p className="text-3xl font-bold mt-1">{stats.upcomingSessions}</p>
              </div>
              <Users className="h-10 w-10 text-orange-600 opacity-50" />
            </div>
          </div>
        </div>

        <Tabs defaultValue="trainings" className="w-full">
          <TabsList>
            <TabsTrigger value="trainings">Formations ({trainings.length})</TabsTrigger>
            <TabsTrigger value="sessions">Sessions ({sessions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="trainings" className="mt-6">
            <TrainingsList
              trainings={trainings}
              onEdit={(training) => {
                toast({
                  title: "Fonctionnalité à venir",
                  description: "L'édition sera bientôt disponible",
                });
              }}
              onDelete={setDeleteId}
            />
          </TabsContent>

          <TabsContent value="sessions" className="mt-6">
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Gestion des sessions disponible via Event Management</p>
            </div>
          </TabsContent>
        </Tabs>

        <TrainingForm
          open={showTrainingForm}
          onOpenChange={setShowTrainingForm}
          onSuccess={loadData}
        />

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer cette formation ? Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ContentUploader;