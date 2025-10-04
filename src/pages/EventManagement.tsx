import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Plus, Clock } from "lucide-react";
import { SessionForm } from "@/components/event-management/SessionForm";

const EventManagement = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        loadSessions();
      }
    });
  }, [navigate]);

  const loadSessions = async () => {
    const { data } = await supabase
      .from("training_sessions")
      .select("*, trainings(title, category)")
      .order("start_date", { ascending: true });
    
    if (data) setSessions(data);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-700 border-blue-200";
      case "in_progress": return "bg-green-100 text-green-700 border-green-200";
      case "completed": return "bg-gray-100 text-gray-700 border-gray-200";
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  const upcomingSessions = sessions.filter(s => new Date(s.start_date) > new Date());
  const pastSessions = sessions.filter(s => new Date(s.start_date) <= new Date());

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Event Management</h1>
            <p className="text-muted-foreground mt-1">
              Planifiez et gérez vos sessions de formation
            </p>
          </div>
          <Button
            className="bg-brand-600 hover:bg-brand-700"
            onClick={() => setShowForm(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle session
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-brand-50 to-white border rounded-xl p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
                <p className="text-3xl font-bold mt-1">{sessions.length}</p>
              </div>
              <Calendar className="h-10 w-10 text-brand-600 opacity-50" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-white border rounded-xl p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">À venir</p>
                <p className="text-3xl font-bold mt-1">{upcomingSessions.length}</p>
              </div>
              <Clock className="h-10 w-10 text-green-600 opacity-50" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-white border rounded-xl p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Passées</p>
                <p className="text-3xl font-bold mt-1">{pastSessions.length}</p>
              </div>
              <Calendar className="h-10 w-10 text-purple-600 opacity-50" />
            </div>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Sessions à venir</h2>
          <div className="grid gap-4">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map((session) => (
                <Card key={session.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle>{session.trainings?.title}</CardTitle>
                        {session.trainings?.category && (
                          <Badge variant="outline" className="mt-2">
                            {session.trainings.category}
                          </Badge>
                        )}
                      </div>
                      <Badge className={`${getStatusColor(session.status)} border`}>
                        {session.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {new Date(session.start_date).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {new Date(session.start_date).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {" - "}
                            {new Date(session.end_date).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {session.location && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{session.location}</span>
                          </div>
                        )}
                        {session.max_participants && (
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>Max: {session.max_participants} participants</span>
                          </div>
                        )}
                        {session.instructor && (
                          <p className="text-sm text-muted-foreground">
                            Formateur: {session.instructor}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Aucune session à venir</p>
              </div>
            )}
          </div>
        </div>

        {/* Past Sessions */}
        {pastSessions.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Sessions passées</h2>
            <div className="grid gap-3">
              {pastSessions.slice(0, 5).map((session) => (
                <Card key={session.id} className="opacity-75">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{session.trainings?.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(session.start_date).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(session.status)} border`}>
                        {session.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <SessionForm
          open={showForm}
          onOpenChange={setShowForm}
          onSuccess={loadSessions}
        />
      </div>
    </div>
  );
};

export default EventManagement;