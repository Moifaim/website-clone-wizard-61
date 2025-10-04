import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Monitor, HardDrive, Cpu, Plus, Wrench, CheckCircle2 } from "lucide-react";
import { AssetForm } from "@/components/computer-admin/AssetForm";
import { WorkOrderForm } from "@/components/computer-admin/WorkOrderForm";
import { useToast } from "@/hooks/use-toast";

const ComputerAdmin = () => {
  const [assets, setAssets] = useState<any[]>([]);
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        loadData();
      }
    });
  }, [navigate]);

  const loadData = async () => {
    const { data: assetsData } = await supabase
      .from("computer_assets")
      .select("*")
      .order("created_at", { ascending: false });
    
    const { data: ordersData } = await supabase
      .from("work_orders")
      .select("*, profiles(first_name, last_name), computer_assets(name)")
      .order("created_at", { ascending: false });
    
    if (assetsData) setAssets(assetsData);
    if (ordersData) setWorkOrders(ordersData);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "hardware": return <Monitor className="h-5 w-5" />;
      case "software": return <HardDrive className="h-5 w-5" />;
      default: return <Cpu className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-700 border-green-200";
      case "assigned": return "bg-blue-100 text-blue-700 border-blue-200";
      case "maintenance": return "bg-orange-100 text-orange-700 border-orange-200";
      case "retired": return "bg-gray-100 text-gray-700 border-gray-200";
      case "completed": return "bg-green-100 text-green-700 border-green-200";
      case "in_progress": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  const stats = {
    totalAssets: assets.length,
    available: assets.filter(a => a.status === "available").length,
    pending: workOrders.filter(w => w.status === "pending").length,
    completed: workOrders.filter(w => w.status === "completed").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Computer Admin</h1>
            <p className="text-muted-foreground mt-1">
              Gestion des assets IT et work orders
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowOrderForm(true)}>
              <Wrench className="mr-2 h-4 w-4" />
              Work Order
            </Button>
            <Button
              className="bg-brand-600 hover:bg-brand-700"
              onClick={() => setShowAssetForm(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Asset
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-brand-50 to-white border rounded-xl p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Assets</p>
                <p className="text-3xl font-bold mt-1">{stats.totalAssets}</p>
              </div>
              <Monitor className="h-10 w-10 text-brand-600 opacity-50" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-white border rounded-xl p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Disponibles</p>
                <p className="text-3xl font-bold mt-1">{stats.available}</p>
              </div>
              <CheckCircle2 className="h-10 w-10 text-green-600 opacity-50" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-white border rounded-xl p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">WO En attente</p>
                <p className="text-3xl font-bold mt-1">{stats.pending}</p>
              </div>
              <Wrench className="h-10 w-10 text-orange-600 opacity-50" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-white border rounded-xl p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">WO Complétés</p>
                <p className="text-3xl font-bold mt-1">{stats.completed}</p>
              </div>
              <CheckCircle2 className="h-10 w-10 text-purple-600 opacity-50" />
            </div>
          </div>
        </div>

        <Tabs defaultValue="assets" className="w-full">
          <TabsList>
            <TabsTrigger value="assets">Assets IT ({assets.length})</TabsTrigger>
            <TabsTrigger value="orders">Work Orders ({workOrders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="assets" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assets.map((asset) => (
                <Card key={asset.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1">
                        {getIcon(asset.type)}
                        <div className="flex-1">
                          <CardTitle className="text-lg">{asset.name}</CardTitle>
                          {asset.version && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {asset.version}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(asset.status)} border`}>
                        {asset.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium">{asset.type}</span>
                    </div>
                    {asset.license_required && (
                      <Badge variant="outline" className="w-fit">
                        Licence requise
                      </Badge>
                    )}
                    {asset.notes && (
                      <p className="text-sm text-muted-foreground line-clamp-2 pt-2">
                        {asset.notes}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <div className="space-y-3">
              {workOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${getStatusColor(order.status)} border`}>
                            {order.status}
                          </Badge>
                          {order.computer_assets && (
                            <span className="text-sm text-muted-foreground">
                              {order.computer_assets.name}
                            </span>
                          )}
                        </div>
                        <p className="font-medium mb-2">{order.description}</p>
                        <p className="text-sm text-muted-foreground">
                          Demandé par: {order.profiles?.first_name} {order.profiles?.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(order.created_at).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      {order.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={async () => {
                            const { error } = await supabase
                              .from("work_orders")
                              .update({ status: "completed", completed_at: new Date().toISOString() })
                              .eq("id", order.id);

                            if (!error) {
                              toast({
                                title: "Work order complété ✅",
                                description: "Le work order a été marqué comme terminé",
                              });
                              loadData();
                            }
                          }}
                        >
                          Marquer complété
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <AssetForm
          open={showAssetForm}
          onOpenChange={setShowAssetForm}
          onSuccess={loadData}
        />

        <WorkOrderForm
          open={showOrderForm}
          onOpenChange={setShowOrderForm}
          onSuccess={loadData}
        />
      </div>
    </div>
  );
};

export default ComputerAdmin;