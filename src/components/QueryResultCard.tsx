import { CheckCircle, XCircle, Clock, Users, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface QueryResultCardProps {
  result: any;
  processingTime?: number;
}

export function QueryResultCard({ result, processingTime }: QueryResultCardProps) {
  const isSuccess = !result.error;

  return (
    <Card className="mb-4 border-border bg-card/50 animate-scale-in">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {isSuccess ? (
              <>
                <CheckCircle className="h-4 w-4 text-success" />
                Query Executed Successfully
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-destructive" />
                Query Failed
              </>
            )}
          </CardTitle>
          {processingTime && (
            <Badge variant="secondary" className="gap-1">
              <Clock className="h-3 w-3" />
              {processingTime.toFixed(2)}s
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {result.agents_used && result.agents_used.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Agents Used</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.agents_used.map((agent: string) => (
                <Badge key={agent} className="gradient-primary text-white border-0">
                  {agent}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {result.plan && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Execution Plan</span>
            </div>
            <div className="bg-muted/50 rounded-md p-3 text-xs font-mono">
              <pre className="whitespace-pre-wrap">{JSON.stringify(result.plan, null, 2)}</pre>
            </div>
          </div>
        )}

        {result.extracted_data && Object.keys(result.extracted_data).length > 0 && (
          <div>
            <span className="text-sm font-medium">Extracted Data</span>
            <div className="bg-muted/50 rounded-md p-3 text-xs font-mono mt-2">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(result.extracted_data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
