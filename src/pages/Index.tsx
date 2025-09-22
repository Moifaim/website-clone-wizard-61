import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import NavigationGrid from "@/components/NavigationGrid";
import ActionItems from "@/components/ActionItems";
import Inbox from "@/components/Inbox";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <NavigationGrid />
      
      <div className="px-6 py-8">
        <div className="grid grid-cols-2 gap-6 max-w-6xl">
          <ActionItems />
          <Inbox />
        </div>
      </div>
    </div>
  );
};

export default Index;
