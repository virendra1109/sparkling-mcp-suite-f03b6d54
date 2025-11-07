import { useState, useEffect } from "react";
import { Users, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { apiClient, AgentInfo, AgentConfig } from "@/lib/api";
import { AgentCard } from "@/components/AgentCard";
import { AddAgentDialog } from "@/components/AddAgentDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Agents() {
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteAgent, setDeleteAgent] = useState<string | null>(null);

  const fetchAgents = async () => {
    try {
      const response = await apiClient.listAgents();
      const agentList = Object.values(response.details);
      setAgents(agentList);
    } catch (error: any) {
      toast.error("Failed to fetch agents", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleAddAgent = async (agent: AgentConfig) => {
    try {
      await apiClient.addAgent(agent);
      toast.success("Agent added successfully!", {
        description: `${agent.display_name} is now available`,
      });
      await fetchAgents();
    } catch (error: any) {
      toast.error("Failed to add agent", {
        description: error.message,
      });
    }
  };

  const handleDeleteAgent = async () => {
    if (!deleteAgent) return;

    try {
      await apiClient.deleteAgent(deleteAgent);
      toast.success("Agent removed successfully!", {
        description: "The agent has been deleted",
      });
      await fetchAgents();
    } catch (error: any) {
      toast.error("Failed to delete agent", {
        description: error.message,
      });
    } finally {
      setDeleteAgent(null);
    }
  };

  const agentToDelete = agents.find((a) => a.name === deleteAgent);

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
              <Users className="h-8 w-8 text-primary" />
              Agent Registry
            </h1>
            <p className="text-muted-foreground">
              Manage your AI agents for multi-agent orchestration
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="px-4 py-2">
              {agents.length} {agents.length === 1 ? "Agent" : "Agents"}
            </Badge>
            <AddAgentDialog onAdd={handleAddAgent} />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Empty State */}
      {!loading && agents.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
            <Users className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No agents yet</h2>
          <p className="text-muted-foreground mb-4">
            Create your first agent to get started
          </p>
          <AddAgentDialog onAdd={handleAddAgent} />
        </div>
      )}

      {/* Agent Grid */}
      {!loading && agents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {agents.map((agent) => (
            <AgentCard
              key={agent.name}
              agent={agent}
              onDelete={(name) => setDeleteAgent(name)}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteAgent} onOpenChange={() => setDeleteAgent(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove{" "}
              <span className="font-semibold text-foreground">
                {agentToDelete?.display_name}
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAgent}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
