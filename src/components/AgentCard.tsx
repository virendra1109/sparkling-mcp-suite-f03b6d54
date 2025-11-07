import { Users, Code, Database, Trash2, Server } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { AgentInfo } from "@/lib/api";

interface AgentCardProps {
  agent: AgentInfo;
  onDelete: (name: string) => void;
}

export function AgentCard({ agent, onDelete }: AgentCardProps) {
  const canDelete = agent.source === "database";

  return (
    <Card className="hover-glow border-border bg-card transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mb-3">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-xs gap-1">
              {agent.source === "code" ? (
                <>
                  <Code className="h-3 w-3" />
                  Code
                </>
              ) : (
                <>
                  <Database className="h-3 w-3" />
                  Database
                </>
              )}
            </Badge>
            {canDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(agent.name)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <CardTitle className="text-lg">{agent.display_name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {agent.requires_mcp && agent.mcp_server && (
          <Badge variant="outline" className="gap-1 text-xs">
            <Server className="h-3 w-3" />
            {agent.mcp_server}
          </Badge>
        )}
        <p className="text-sm text-muted-foreground">{agent.description}</p>
        <div className="flex flex-wrap gap-2">
          {agent.capabilities.map((capability) => (
            <Badge key={capability} variant="secondary" className="text-xs">
              {capability}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
