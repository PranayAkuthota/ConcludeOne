import { useState, useEffect } from "react";
import { BrainCircuit, Database, Network, Search, Zap, Loader2, CheckCircle2, ArrowRight, ShieldAlert, Cpu, Sparkles, ChevronRight, Activity } from "lucide-react";

export default function Memory() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  // Nodes for the complex reasoning memory graph
  const nodes = [
    { id: 1, label: "Orchestration Hub", type: "core", x: 50, y: 50, icon: Network, details: "The multi-agent graph engine coordinating inputs and output states.", status: "Active" },
    
    // Inputs (Left column)
    { id: 2, label: "CRM History", type: "input", x: 22, y: 32, icon: Database, details: "Accounts metrics, health scores, AE logs, and contract values.", status: "Synced" },
    { id: 3, label: "Call Audio Transcripts", type: "input", x: 18, y: 50, icon: Cpu, details: "Raw meeting transcripts and natural language objection inputs.", status: "Synced" },
    { id: 4, label: "Email Threads", type: "input", x: 24, y: 68, icon: Activity, details: "Customer support cases, escalation tickets, and email threads.", status: "Synced" },
    
    // Agents (Top / Bottom clusters)
    { id: 5, label: "Meeting Agent", type: "agent", x: 38, y: 25, icon: BrainCircuit, details: "Extracts key pain points, sentiment, and objections from calls.", status: "Idle" },
    { id: 6, label: "CRM Agent", type: "agent", x: 62, y: 25, icon: Database, details: "Parses account health metrics, ARR, and sales opportunity stage.", status: "Idle" },
    { id: 7, label: "Context RAG Engine", type: "agent", x: 42, y: 75, icon: Search, details: "Queries ChromaDB for semantically matching playbooks.", status: "Active" },
    { id: 8, label: "Risk Analyst Agent", type: "agent", x: 58, y: 75, icon: ShieldAlert, details: "Computes Deal Risk and Churn Risk parameters dynamically.", status: "Idle" },

    // Policy Playbooks (Bottom right)
    { id: 9, label: "Churn Prevention Playbook", type: "playbook", x: 74, y: 78, icon: Zap, details: "Rules for retaining high-value enterprise accounts.", status: "Active" },
    { id: 10, label: "Standard Discount margins", type: "playbook", x: 84, y: 66, icon: Sparkles, details: "Allowed pricing tiers and standard concession guidelines.", status: "Active" },

    // Outputs (Right column)
    { id: 11, label: "Executive Briefs", type: "output", x: 76, y: 46, icon: CheckCircle2, details: "Recommendations, priorities, and confidence score outputs.", status: "Active" },
    { id: 12, label: "Approved Actions", type: "output", x: 85, y: 32, icon: ArrowRight, details: "Actions approved by human review and scheduled for execution.", status: "Executed" },
    { id: 13, label: "Long-Term Memory Node", type: "output", x: 88, y: 50, icon: BrainCircuit, details: "MongoDB persistence logs feeding historic outcomes back to the hub.", status: "Active" }
  ];

  // Links connecting the nodes
  const links = [
    { from: 2, to: 1 }, { from: 3, to: 1 }, { from: 4, to: 1 },
    { from: 2, to: 6 }, { from: 3, to: 5 },
    { from: 5, to: 1 }, { from: 6, to: 1 }, { from: 7, to: 1 },
    { from: 1, to: 8 },
    { from: 8, to: 11 }, { from: 7, to: 9 }, { from: 7, to: 10 },
    { from: 11, to: 12 }, { from: 11, to: 13 },
    { from: 13, to: 1 } // Feedback loop
  ];

  useEffect(() => {
    // Default select Orchestration Hub on mount
    setSelectedNode(nodes[0]);
  }, []);

  const handleSync = () => {
    setIsSyncing(true);
    setSyncComplete(false);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncComplete(true);
      setTimeout(() => setSyncComplete(false), 3000);
    }, 2000);
  };

  useEffect(() => {
    if (searchQuery.length > 1) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
        // Try to match a node label
        const matched = nodes.find(n => n.label.toLowerCase().includes(searchQuery.toLowerCase()));
        if (matched) setSelectedNode(matched);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  const getNodeColorClass = (type) => {
    switch (type) {
      case "core": return "bg-indigo-600 border-indigo-200 text-white shadow-indigo-100 ring-indigo-400";
      case "input": return "bg-blue-50 border-blue-200 text-blue-700 shadow-blue-50 ring-blue-300";
      case "agent": return "bg-amber-50 border-amber-200 text-amber-700 shadow-amber-50 ring-amber-300";
      case "playbook": return "bg-purple-50 border-purple-200 text-purple-700 shadow-purple-50 ring-purple-300";
      default: return "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-emerald-50 ring-emerald-300";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-border/50 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Enterprise Reasoning Memory</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Browse and query the multi-agent graph of historical decisions, outcomes, and business context.
          </p>
        </div>
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className={`px-5 py-2.5 rounded-md text-sm font-bold flex items-center transition-all shadow-sm ${
            syncComplete ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 
            isSyncing ? 'bg-indigo-400 text-white cursor-not-allowed' : 
            'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {syncComplete ? (
            <><CheckCircle2 className="w-4 h-4 mr-2" /> Graph Synced</>
          ) : isSyncing ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Fetching Nodes...</>
          ) : (
            <><Database className="w-4 h-4 mr-2" /> Sync Memory Data</>
          )}
        </button>
      </div>

      {/* KPI Cards & Automation Rate Detail */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-xl border-t-4 border-indigo-500 hover:shadow-md transition-shadow">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Total Nodes</span>
          <div className="text-3xl font-black mt-2 text-indigo-950">24,931</div>
          <p className="text-xs text-muted-foreground mt-3">Active memory graph nodes</p>
        </div>

        {/* Impressive Automation Rate Widget */}
        <div className="glass-panel p-6 rounded-xl border-t-4 border-emerald-500 hover:shadow-md transition-shadow md:col-span-2">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Automation Rate</span>
              <div className="text-3xl font-black mt-2 text-emerald-950 flex items-center">
                94.2% <Zap className="w-5 h-5 text-emerald-500 ml-2 animate-pulse" />
              </div>
            </div>
            {/* Visual Mini Chart Bar */}
            <div className="flex space-x-1.5 items-end h-12 pt-2">
              <div className="w-2.5 bg-emerald-100 rounded-sm h-[60%]" />
              <div className="w-2.5 bg-emerald-200 rounded-sm h-[75%]" />
              <div className="w-2.5 bg-emerald-300 rounded-sm h-[80%]" />
              <div className="w-2.5 bg-emerald-400 rounded-sm h-[90%]" />
              <div className="w-2.5 bg-emerald-600 rounded-sm h-[94.2%]" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            <span className="text-emerald-700 font-bold mr-1">94.2%</span> of recommendations exceed the <span className="font-semibold">90% confidence threshold</span> and are executed autonomously. The remaining 5.8% are held for Human-in-the-Loop review.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-xl border-t-4 border-purple-500 hover:shadow-md transition-shadow">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Active Embeddings</span>
          <div className="text-3xl font-black mt-2 text-purple-950">3.2M</div>
          <p className="text-xs text-muted-foreground mt-3">High-dimensional vector storage</p>
        </div>
      </div>

      {/* Main Grid: Interactive Graph + Metadata Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Large SVG Network Visualizer */}
        <div className="lg:col-span-8 glass-panel rounded-xl overflow-hidden flex flex-col bg-white">
          {/* Search Box */}
          <div className="p-4 bg-white border-b border-border flex items-center relative z-20 shadow-sm">
            <Search className={`w-5 h-5 mr-3 ${searchQuery ? 'text-indigo-600' : 'text-muted-foreground'}`} />
            <input 
              type="text" 
              placeholder="Search nodes or patterns (e.g. 'Standard Discount')" 
              className="bg-transparent border-none text-[14px] font-medium w-full outline-none placeholder:text-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {isSearching && <Loader2 className="w-4 h-4 text-indigo-500 animate-spin absolute right-4" />}
          </div>

          {/* Graph viewport */}
          <div className="relative h-[550px] w-full overflow-hidden bg-slate-900/5 flex items-center justify-center">
            
            {/* Grid background effect */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:30px_30px] opacity-[0.4]" />

            {/* SVG Link lines */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 5 }}>
              {links.map((link, idx) => {
                const fromNode = nodes.find(n => n.id === link.from);
                const toNode = nodes.find(n => n.id === link.to);
                if (!fromNode || !toNode) return null;

                const isHighlighted = selectedNode && (selectedNode.id === link.from || selectedNode.id === link.to);

                return (
                  <line
                    key={idx}
                    x1={`${fromNode.x}%`}
                    y1={`${fromNode.y}%`}
                    x2={`${toNode.x}%`}
                    y2={`${toNode.y}%`}
                    stroke={isHighlighted ? "#6366f1" : "#cbd5e1"}
                    strokeWidth={isHighlighted ? "3" : "1.5"}
                    strokeDasharray={fromNode.type === "playbook" ? "4" : undefined}
                    className={`transition-all duration-300 ${isHighlighted ? 'animate-pulse' : ''}`}
                  />
                );
              })}
            </svg>

            {/* Render Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNode && selectedNode.id === node.id;
              const NodeIcon = node.icon;

              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  className={`absolute z-10 p-3 rounded-full border-2 transition-all duration-300 flex items-center justify-center shadow-lg group hover:scale-110 active:scale-95 ${getNodeColorClass(node.type)} ${
                    isSelected ? 'ring-4 ring-offset-2 scale-110' : ''
                  }`}
                >
                  <NodeIcon className={`w-5 h-5 ${node.type === "core" ? 'w-6 h-6' : ''}`} />
                  
                  {/* Floating Tooltip Label */}
                  <span className={`absolute top-11 px-2.5 py-1 rounded bg-slate-900 text-white text-[10px] font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30`}>
                    {node.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Metadata Inspector Panel */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          
          {/* Selected Node Details Card */}
          <div className="glass-panel p-6 rounded-xl bg-white shadow-sm flex flex-col flex-1 justify-between">
            {selectedNode ? (
              <div className="space-y-6 animate-fade-in flex flex-col h-full justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border/50 pb-3">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Node Inspector</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                      selectedNode.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      selectedNode.status === 'Synced' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      selectedNode.status === 'Executed' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      'bg-slate-50 text-slate-700 border-slate-200'
                    }`}>
                      {selectedNode.status}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
                      {(() => {
                        const Icon = selectedNode.icon;
                        return <Icon className="w-5 h-5" />;
                      })()}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-indigo-950 leading-tight">{selectedNode.label}</h3>
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase">{selectedNode.type} Node</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Node Details</h4>
                    <p className="text-sm text-slate-700 leading-relaxed bg-[#F9FAFB] border border-border p-3.5 rounded-lg font-medium">
                      {selectedNode.details}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Coordinates</h4>
                    <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                      <div className="bg-slate-50 border border-slate-100 p-2 rounded flex justify-between">
                        <span className="text-slate-400">Position X</span>
                        <span className="text-slate-700">{selectedNode.x}%</span>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 p-2 rounded flex justify-between">
                        <span className="text-slate-400">Position Y</span>
                        <span className="text-slate-700">{selectedNode.y}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border/50">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Relations:</span>
                    <span className="font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                      {links.filter(l => l.from === selectedNode.id || l.to === selectedNode.id).length} links
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12 text-muted-foreground">
                <BrainCircuit className="w-8 h-8 text-slate-300 animate-pulse mb-3" />
                <p className="text-sm">Select any node on the graph to inspect its details and context links.</p>
              </div>
            )}
          </div>

          {/* Automation Rate Analytics Info Card */}
          <div className="glass-panel p-6 rounded-xl bg-white shadow-sm space-y-4">
            <h3 className="tracking-widest text-[11px] font-bold uppercase text-muted-foreground border-b border-border/50 pb-2">Automation Calibration</h3>
            
            <div className="flex items-center space-x-3.5">
              <div className="flex shrink-0 items-center justify-center h-11 w-11 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                <Sparkles className="w-5.5 h-5.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-800 leading-tight">Confidence Cut-Off</div>
                <div className="text-xs text-muted-foreground mt-0.5">Threshold configured at 90%</div>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs font-semibold text-slate-600 leading-relaxed">
              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                <span>Autonomous decisions</span>
                <span className="text-emerald-700">94.2%</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                <span>Human validation pending</span>
                <span className="text-amber-700">5.8%</span>
              </div>
              <div className="flex justify-between">
                <span>Auto-Refined by feedback</span>
                <span className="text-indigo-600">89.4%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
