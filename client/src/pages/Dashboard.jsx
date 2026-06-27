import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Activity, ShieldAlert, CheckCircle2, Clock, ArrowRight, BrainCircuit, AlertTriangle } from "lucide-react";

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [activeCases, setActiveCases] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  
  useEffect(() => {
    fetch("http://localhost:3005/api/analytics")
      .then(res => res.json())
      .then(data => setAnalytics(data))
      .catch(err => console.error(err));

    fetch("http://localhost:3005/api/cases")
      .then(res => res.json())
      .then(data => {
        setActiveCases(data.filter(c => c.status === "Processing").slice(0, 4));
        setPendingApprovals(data.filter(c => c.status === "Requires Approval").slice(0, 4));
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border/50 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Executive Command Center</h1>
          <p className="text-muted-foreground mt-1 text-[15px]">
            Real-time multi-agent decision intelligence.
          </p>
        </div>
      </div>
      
      {analytics ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="glass-panel p-6 rounded-xl transition-shadow hover:shadow-md">
            <h3 className="tracking-widest text-[11px] font-bold uppercase text-muted-foreground mb-4">Decisions Generated</h3>
            <div className="flex items-end justify-between">
              <div className="text-4xl font-semibold tracking-tight">{analytics.recommendationsGenerated}</div>
              <Activity className="h-5 w-5 text-muted-foreground mb-1" />
            </div>
          </div>
          <div className="glass-panel p-6 rounded-xl transition-shadow hover:shadow-md">
            <h3 className="tracking-widest text-[11px] font-bold uppercase text-muted-foreground mb-4">Automation Rate</h3>
            <div className="flex items-end justify-between">
              <div className="text-4xl font-semibold tracking-tight text-emerald-600">{analytics.approvalRate}</div>
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mb-1" />
            </div>
          </div>
          <div className="glass-panel p-6 rounded-xl transition-shadow hover:shadow-md">
            <h3 className="tracking-widest text-[11px] font-bold uppercase text-muted-foreground mb-4">AI Confidence</h3>
            <div className="flex items-end justify-between">
              <div className="text-4xl font-semibold tracking-tight">{analytics.averageConfidence}</div>
              <ShieldAlert className="h-5 w-5 text-muted-foreground mb-1" />
            </div>
          </div>
          <div className="glass-panel p-6 rounded-xl transition-shadow hover:shadow-md">
            <h3 className="tracking-widest text-[11px] font-bold uppercase text-muted-foreground mb-4">Avg Latency</h3>
            <div className="flex items-end justify-between">
              <div className="text-4xl font-semibold tracking-tight">{analytics.averageProcessingTime}</div>
              <Clock className="h-5 w-5 text-muted-foreground mb-1" />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-4 animate-pulse">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-card/50 rounded-2xl" />)}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Orchestrations */}
        <div className="glass-panel p-8 rounded-xl flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-lg font-bold tracking-tight">Active Orchestrations</h2>
             <Link to="/cases" className="text-sm text-primary hover:underline flex items-center font-medium">
                View all <ArrowRight className="ml-1 h-4 w-4" />
             </Link>
          </div>
          <div className="space-y-3 flex-1">
            {activeCases.length > 0 ? activeCases.map(c => (
              <Link key={c._id} to={`/cases/${c._id}`} className="block border border-border/50 bg-[#F9FAFB] hover:bg-gray-100 rounded-lg p-4 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-[14px]">{c.title}</span>
                  <span className="inline-flex items-center text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-300 px-2.5 py-0.5 rounded-sm uppercase tracking-wider">
                    Processing
                  </span>
                </div>
                <div className="text-[13px] text-muted-foreground truncate">{c.customerId} • Agents analyzing context...</div>
              </Link>
            )) : (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground border border-dashed border-border rounded-lg bg-[#F9FAFB]">
                <p className="text-sm font-medium">No active workflows.</p>
              </div>
            )}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="glass-panel p-8 rounded-xl flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-lg font-bold tracking-tight">Pending Approvals</h2>
             <Link to="/approvals" className="text-sm text-primary hover:underline flex items-center font-medium">
                View all <ArrowRight className="ml-1 h-4 w-4" />
             </Link>
          </div>
          <div className="space-y-3 flex-1">
            {pendingApprovals.length > 0 ? pendingApprovals.map(c => (
              <Link key={c._id} to={`/cases/${c._id}`} className="block border border-border/50 bg-[#F9FAFB] hover:bg-gray-100 rounded-lg p-4 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-[14px]">{c.title}</span>
                  <span className="inline-flex items-center text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded-sm uppercase tracking-wider">
                    Review Required
                  </span>
                </div>
                <div className="text-[13px] text-muted-foreground truncate">{c.customerId} • Confidence {c.aiData?.recommendation?.confidenceScore}%</div>
              </Link>
            )) : (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground border border-dashed border-border rounded-lg bg-[#F9FAFB]">
                <p className="text-sm font-medium">All recommendations auto-approved.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
