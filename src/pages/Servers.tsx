import { useState, useEffect } from "react";
import { Server, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { apiClient, ServerInfo } from "@/lib/api";
import { ServerCard } from "@/components/ServerCard";

export default function Servers() {
  const [servers, setServers] = useState<ServerInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServers = async () => {
    try {
      const response = await apiClient.listServers();
      const serverList = Object.values(response.details);
      setServers(serverList);
    } catch (error: any) {
      toast.error("Failed to fetch servers", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServers();
    const interval = setInterval(fetchServers, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
              <Server className="h-8 w-8 text-primary" />
              MCP Server Registry
            </h1>
            <p className="text-muted-foreground">
              Manage your Model Context Protocol servers
            </p>
          </div>
          <Badge variant="secondary" className="px-4 py-2">
            {servers.length} {servers.length === 1 ? "Server" : "Servers"}
          </Badge>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Empty State */}
      {!loading && servers.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
            <Server className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No servers yet</h2>
          <p className="text-muted-foreground">
            MCP servers are loaded from backend configuration
          </p>
        </div>
      )}

      {/* Server Grid */}
      {!loading && servers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {servers.map((server) => (
            <ServerCard key={server.name} server={server} />
          ))}
        </div>
      )}
    </div>
  );
}
