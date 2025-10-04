import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  
  const navItems = [
    { icon: ThumbsUp, label: "Approvals &", sublabel: "Requests", path: "/approvals-requests" },
    { icon: Cloud, label: "Content", sublabel: "Uploader", path: "/content-uploader" },
    { icon: Monitor, label: "Computer", sublabel: "Admin", path: "/computer-admin" },
    { icon: ClipboardList, label: "Assignment", sublabel: "Tool", path: "/assignment-tool" },
    { icon: Calendar, label: "Event", sublabel: "Management", path: "/event-management" },
    { icon: Users, label: "Cohorts &", sublabel: "Communities", path: "/cohorts-communities" },
    { icon: Network, label: "Organizational", sublabel: "Units", path: "/organizational-units" },
  ];

  return (
    <div className="bg-white py-8">
      <div className="grid grid-cols-7 gap-4 px-6">
        {navItems.map((item, index) => (
          <div 
            key={index} 
            onClick={() => navigate(item.path)}
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