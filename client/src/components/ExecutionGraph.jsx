import React from 'react';
import { Cpu, Database, BrainCircuit, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw, Layers } from 'lucide-react';

export default function ExecutionGraph({ logs, status }) {
  if (!logs || logs.length === 0) return null;

  // Group logs into pipeline stages
  const stages = [
    { id: 'planner', label: 'Orchestration', agents: ['Planner Agent'] },
    { id: 'parallel', label: 'Parallel Retrieval & Context', agents: ['Meeting Agent', 'CRM Context Agent', 'Enterprise Context Agent'] },
    { id: 'gather', label: 'State Sync', agents: ['Parallel Gather'] },
    { id: 'risk', label: 'Risk Analysis', agents: ['Risk Agent'] },
    { id: 'recommendation', label: 'Reasoning & Confidence', agents: ['Recommendation Agent'] },
    { id: 'approval', label: 'Approval & Explainability', agents: ['Explainability Agent'] },
    { id: 'memory', label: 'Long-term Memory', agents: ['Memory Agent'] }
  ];

  const getAgentLogs = (agentNames) => logs.filter(log => agentNames.includes(log.agentName));

  const AgentCard = ({ log }) => {
    let Icon = Cpu;
    if (log.agentName.includes('Planner')) Icon = BrainCircuit;
    if (log.agentName.includes('Context')) Icon = Database;
    if (log.agentName.includes('Risk')) Icon = AlertTriangle;
    if (log.agentName.includes('Recommendation')) Icon = Layers;
    if (log.agentName.includes('Explainability')) Icon = ShieldCheck;

    return (
      <div className="relative flex flex-col items-center p-4 bg-white border border-border/50 rounded-lg shadow-sm hover:shadow-md transition-shadow w-full">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-foreground mb-3 border border-border/50">
          <Icon className="w-4 h-4" />
        </div>
        <div className="text-[11px] font-bold text-center tracking-wide">{log.agentName}</div>
        <div className="text-[10px] text-muted-foreground mt-1 text-center truncate w-full px-1" title={log.outputSummary}>
          {log.outputSummary}
        </div>
        <div className="mt-2 flex items-center space-x-1">
          {log.status === 'Success' ? (
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          ) : (
            <AlertTriangle className="w-3 h-3 text-destructive" />
          )}
          <span className="text-[10px] text-muted-foreground">{log.executionTimeMs}ms</span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-[#F9FAFB] border border-border/50 rounded-xl p-8 overflow-x-auto">
      <div className="flex items-center mb-8">
        <BrainCircuit className="w-4 h-4 text-muted-foreground mr-2" />
        <h3 className="font-bold text-[11px] uppercase tracking-widest text-muted-foreground">Execution Pipeline</h3>
        {status === 'Processing' && (
          <span className="ml-4 inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full animate-pulse">
            <RefreshCw className="w-3 h-3 mr-1.5 animate-spin" /> Orchestrating
          </span>
        )}
      </div>

      <div className="flex items-start min-w-[800px] pb-4">
        {stages.map((stage, index) => {
          const stageLogs = getAgentLogs(stage.agents);
          if (stageLogs.length === 0 && status !== 'Processing') return null; // Skip empty stages if finished

          return (
            <React.Fragment key={stage.id}>
              {/* Node Column */}
              <div className="flex flex-col items-center w-48 shrink-0 relative">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6 h-8 text-center flex items-center justify-center">
                  {stage.label}
                </div>
                
                <div className="flex flex-col space-y-4 w-full px-2">
                  {stageLogs.map((log, i) => (
                    <AgentCard key={i} log={log} />
                  ))}
                  {stageLogs.length === 0 && status === 'Processing' && (
                    <div className="flex flex-col items-center p-3 border border-dashed border-border rounded-xl opacity-50 animate-pulse">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-2" />
                      <div className="h-3 w-16 bg-muted rounded" />
                    </div>
                  )}
                </div>
              </div>

              {/* Edge */}
              {index < stages.length - 1 && (
                <div className="flex items-center justify-center h-32 w-12 shrink-0">
                  <div className="w-full h-0.5 bg-border relative">
                    <div className="absolute right-0 -top-1 w-2 h-2 border-t-2 border-r-2 border-border transform rotate-45" />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
