import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, HardDrive, Cpu, Plus } from "lucide-react";

const ComputerAdmin = () => {
  const [assets, setAssets] = useState<any[]>([]);
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const navigate = useNavigate();

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
      .select("*, profiles(first_name, last_name)")
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Computer Admin</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvel asset
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Assets IT</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {assets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getIcon(asset.type)}
                      <div>
                        <p className="font-medium">{asset.name}</p>
                        <p className="text-sm text-muted-foreground">{asset.type}</p>
                      </div>
                    </div>
                    <Badge variant={asset.status === "available" ? "default" : "secondary"}>
                      {asset.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Work Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workOrders.map((order) => (
                  <div key={order.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium">{order.description}</p>
                      <Badge>{order.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Demandé par: {order.profiles?.first_name} {order.profiles?.last_name}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ComputerAdmin;