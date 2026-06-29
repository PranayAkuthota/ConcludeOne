import { useState, useEffect } from "react";
import { Bot, Clock, Activity } from "lucide-react";
import { apiFetch } from "../lib/api";

export default function AgentsLibrary() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    apiFetch("http://localhost:3005/api/agents")
      .then(res => res.json())
      .then(data => setAgents(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agent Library</h1>
        <p className="text-muted-foreground mt-2">
          Monitor status and metrics of platform AI agents.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {agents.map(agent => (
          <div key={agent.name} className="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6 hover:border-primary/50 transition-colors">
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-base leading-tight">{agent.name}</h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground min-h-[40px]">{agent.description}</p>
            <div className="flex justify-between text-xs mt-6 pt-4 border-t border-border">
              <div className="flex items-center text-muted-foreground">
                <Activity className="h-3 w-3 mr-1.5" /> {agent.status}
              </div>
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-3 w-3 mr-1.5" /> {agent.executionTime} avg
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
