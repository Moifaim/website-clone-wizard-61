import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ActionItems = () => {
  const actionItems = [
    { title: "Satisfaction Survey", dueDate: "7/31/2020" },
    { title: "Manage: CPR Certification", dueDate: "8/9/2020" },
    { title: "Launch: Code of Ethics", dueDate: "10/31/2020" },
    { title: "Complete: Manager Sexual Review of Linda Morris", dueDate: "12/30/2020" },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="bg-portal-blue-dark text-white">
        <CardTitle className="text-sm font-medium uppercase tracking-wide">Action Items</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {actionItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center px-4 py-3 hover:bg-muted/30 transition-colors">
              <span className="text-sm text-foreground">{item.title}</span>
              <span className="text-sm text-muted-foreground font-medium">{item.dueDate}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionItems;