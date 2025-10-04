import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import heroBackground from "@/assets/hero-background.jpg";

const HeroSection = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name")
          .eq("id", user.id)
          .single();
        
        if (profile?.first_name) {
          setFirstName(profile.first_name);
        }
      }
      setLoading(false);
    };

    loadUserProfile();
  }, []);

  return (
    <section 
      className="relative min-h-[400px] bg-cover bg-center flex items-center"
      style={{ backgroundImage: `url(${heroBackground})` }}
    >
      <div className="absolute inset-0 bg-portal-overlay"></div>
      <div className="relative z-10 px-6 py-16">
        <h1 className="text-5xl font-normal text-white mb-2">
          {loading ? "Hello..." : `Hello, ${firstName || "User"}.`}
        </h1>
        <p className="text-xl text-white/90 mb-8">Talent Strategist Portal</p>
        <Button variant="destructive" className="bg-portal-red hover:bg-portal-red/90 text-portal-red-foreground px-6 py-2">
          Dashboards
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;