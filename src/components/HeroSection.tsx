import { Button } from "@/components/ui/button";
import heroBackground from "@/assets/hero-background.jpg";

const HeroSection = () => {
  return (
    <section 
      className="relative min-h-[400px] bg-cover bg-center flex items-center"
      style={{ backgroundImage: `url(${heroBackground})` }}
    >
      <div className="absolute inset-0 bg-portal-overlay"></div>
      <div className="relative z-10 px-6 py-16">
        <h1 className="text-5xl font-normal text-white mb-2">Hello, Lori.</h1>
        <p className="text-xl text-white/90 mb-8">Talent Strategist Portal</p>
        <Button variant="destructive" className="bg-portal-red hover:bg-portal-red/90 text-portal-red-foreground px-6 py-2">
          Dashboards
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;