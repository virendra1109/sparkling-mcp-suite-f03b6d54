import { useState, useEffect, useRef } from "react";
import { Sparkles, Send, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import { Message, ExampleQuery } from "@/types";
import { ChatMessage } from "@/components/ChatMessage";
import { QueryResultCard } from "@/components/QueryResultCard";

const exampleQueries: ExampleQuery[] = [
  {
    id: "1",
    text: "Post a hello message in the general channel",
    icon: "💬",
  },
  {
    id: "2",
    text: "Fetch all HubSpot deals over $10,000",
    icon: "💰",
  },
  {
    id: "3",
    text: "List all available Slack channels",
    icon: "📋",
  },
  {
    id: "4",
    text: "Get contacts from HubSpot and notify in Slack",
    icon: "🔔",
  },
];

const loadingSteps = [
  "🤖 Analyzing your query...",
  "🔍 Selecting relevant servers...",
  "🛠️ Searching for tools...",
  "⚡ Executing your request...",
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [loadingStep, setLoadingStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("chat_messages");
    const savedSession = localStorage.getItem("session_id");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved messages", e);
      }
    }
    if (savedSession) {
      setSessionId(savedSession);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem("session_id", sessionId);
    }
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleNewConversation = async () => {
    try {
      if (sessionId) {
        await apiClient.clearSession(sessionId);
      }
      const response = await apiClient.createSession();
      setSessionId(response.session_id);
      setMessages([]);
      localStorage.removeItem("chat_messages");
      toast.info("Started new conversation", {
        description: "Previous context cleared",
      });
    } catch (error: any) {
      toast.error("Failed to start new conversation", {
        description: error.message,
      });
    }
  };

  const handleSubmit = async (queryText?: string) => {
    const query = queryText || input.trim();
    if (!query) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setLoadingStep(0);

    const startTime = Date.now();

    try {
      const response = await apiClient.processQuery(query, sessionId || undefined);
      const processingTime = (Date.now() - startTime) / 1000;

      if (!sessionId) {
        setSessionId(response.session_id);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.result,
        timestamp: Date.now(),
        queryResult: response,
        processingTime,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      toast.success("Query executed successfully!", {
        description: `Completed in ${processingTime.toFixed(2)}s`,
      });
    } catch (error: any) {
      toast.error("Failed to process query", {
        description: error.message,
      });
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Error: ${error.message}`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 mb-2">
                <Sparkles className="h-7 w-7 text-primary animate-pulse" />
                Multi-MCP Agent Chat
              </h1>
              <p className="text-muted-foreground">
                Ask me to do anything across your connected services
              </p>
            </div>
            {messages.length > 0 && (
              <Button
                onClick={handleNewConversation}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                New Conversation
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="container max-w-5xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="text-center py-12 space-y-8">
              <div className="inline-block">
                <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center animate-pulse-glow">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Welcome to Multi-MCP Chat</h2>
                <p className="text-muted-foreground mb-8">
                  Try one of these example queries to get started
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {exampleQueries.map((example) => (
                  <button
                    key={example.id}
                    onClick={() => handleSubmit(example.text)}
                    className="p-4 rounded-lg border border-border bg-card hover:bg-accent transition-all text-left hover-glow"
                  >
                    <div className="text-2xl mb-2">{example.icon}</div>
                    <p className="text-sm">{example.text}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id}>
                  <ChatMessage message={message} />
                  {message.queryResult && (
                    <QueryResultCard
                      result={message.queryResult}
                      processingTime={message.processingTime}
                    />
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-3 mb-6 animate-fade-in">
                  <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center">
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="px-4 py-3 rounded-lg bg-card border border-border">
                      <p className="text-sm text-muted-foreground animate-pulse">
                        {loadingSteps[loadingStep]}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card/50 backdrop-blur-sm sticky bottom-0">
        <div className="container max-w-5xl mx-auto px-4 py-4">
          <div className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
              className="min-h-[80px] pr-14 resize-none"
              disabled={loading}
            />
            <Button
              onClick={() => handleSubmit()}
              disabled={loading || !input.trim()}
              size="icon"
              variant="gradient"
              className="absolute bottom-2 right-2"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
