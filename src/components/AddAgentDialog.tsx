import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { AgentConfig } from "@/lib/api";

interface AddAgentDialogProps {
  onAdd: (agent: AgentConfig) => void;
}

export function AddAgentDialog({ onAdd }: AddAgentDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<AgentConfig>({
    name: "",
    display_name: "",
    description: "",
    instructions: "",
    capabilities: [],
    requires_mcp: false,
    mcp_server: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const capabilities = formData.capabilities[0]
      ? String(formData.capabilities[0])
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean)
      : [];
    
    onAdd({
      ...formData,
      capabilities,
      mcp_server: formData.requires_mcp ? formData.mcp_server : undefined,
    });
    
    setFormData({
      name: "",
      display_name: "",
      description: "",
      instructions: "",
      capabilities: [],
      requires_mcp: false,
      mcp_server: "",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gradient">
          <Plus className="h-4 w-4 mr-2" />
          Add Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Agent</DialogTitle>
          <DialogDescription>
            Create a new AI agent for multi-agent orchestration
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Agent ID <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., slack_agent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_name">
              Display Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="display_name"
              required
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              placeholder="e.g., Slack Agent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              required
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the agent's purpose"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">
              Instructions <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="instructions"
              required
              rows={3}
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              placeholder="System instructions for the agent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capabilities">
              Capabilities <span className="text-destructive">*</span>
            </Label>
            <Input
              id="capabilities"
              required
              value={formData.capabilities}
              onChange={(e) => setFormData({ ...formData, capabilities: [e.target.value] as any })}
              placeholder="comma, separated, capabilities"
            />
            <p className="text-xs text-muted-foreground">
              Enter capabilities separated by commas
            </p>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="requires_mcp">Requires MCP Server</Label>
              <p className="text-xs text-muted-foreground">
                Enable if this agent needs an MCP server
              </p>
            </div>
            <Switch
              id="requires_mcp"
              checked={formData.requires_mcp}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, requires_mcp: checked })
              }
            />
          </div>

          {formData.requires_mcp && (
            <div className="space-y-2">
              <Label htmlFor="mcp_server">MCP Server Name</Label>
              <Input
                id="mcp_server"
                value={formData.mcp_server}
                onChange={(e) => setFormData({ ...formData, mcp_server: e.target.value })}
                placeholder="e.g., slack"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient">
              Create Agent
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
