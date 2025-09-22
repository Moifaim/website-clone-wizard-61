import { 
  ThumbsUp, 
  Cloud, 
  Monitor, 
  ClipboardList, 
  Calendar, 
  Users, 
  Network 
} from "lucide-react";

const NavigationGrid = () => {
  const navItems = [
    { icon: ThumbsUp, label: "Approvals &", sublabel: "Requests" },
    { icon: Cloud, label: "Content", sublabel: "Uploader" },
    { icon: Monitor, label: "Computer", sublabel: "Admin" },
    { icon: ClipboardList, label: "Assignment", sublabel: "Tool" },
    { icon: Calendar, label: "Event", sublabel: "Management" },
    { icon: Users, label: "Cohorts &", sublabel: "Communities" },
    { icon: Network, label: "Organizational", sublabel: "Units" },
  ];

  return (
    <div className="bg-white py-8">
      <div className="grid grid-cols-7 gap-4 px-6">
        {navItems.map((item, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center text-center cursor-pointer hover:bg-muted/50 p-4 rounded-lg transition-colors"
          >
            <item.icon className="w-10 h-10 text-primary mb-3" />
            <div className="text-sm text-muted-foreground">
              <div>{item.label}</div>
              <div>{item.sublabel}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavigationGrid;