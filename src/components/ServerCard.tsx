import { Server, Wrench, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ServerInfo } from "@/lib/api";

interface ServerCardProps {
  server: ServerInfo;
}

export function ServerCard({ server }: ServerCardProps) {
  return (
    <Card className="hover-glow border-border bg-card transition-all cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mb-3">
            <Server className="h-6 w-6 text-white" />
          </div>
          <Badge variant="secondary" className="text-xs">
            {server.type}
          </Badge>
        </div>
        <CardTitle className="text-lg">{server.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-success">
          <CheckCircle className="h-3 w-3" />
          <span>{server.status}</span>
        </div>
        {server.description && (
          <p className="text-sm text-muted-foreground">{server.description}</p>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Wrench className="h-4 w-4" />
          <span>{server.tools_count} tools available</span>
        </div>
      </CardContent>
    </Card>
  );
}
