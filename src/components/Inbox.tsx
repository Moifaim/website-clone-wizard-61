import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Inbox = () => {
  const inboxItems = [
    {
      title: "View transcript",
      description: "(1 approved training selection(s))",
      subtitle: "(Registered for 9 training selection(s))"
    },
    {
      title: "Approve training",
      description: "(Your employees have 1 training request(s) pending approval)"
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader className="bg-portal-red text-portal-red-foreground">
        <CardTitle className="text-sm font-medium uppercase tracking-wide">Inbox</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {inboxItems.map((item, index) => (
            <div key={index} className="px-4 py-3 hover:bg-muted/30 transition-colors">
              <div className="text-sm text-foreground font-medium mb-1">{item.title}</div>
              <div className="text-sm text-muted-foreground">{item.description}</div>
              {item.subtitle && (
                <div className="text-sm text-muted-foreground">{item.subtitle}</div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Inbox;