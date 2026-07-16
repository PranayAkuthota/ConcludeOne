import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Activity, ShieldAlert, CheckCircle2, Clock, ArrowRight, AlertTriangle, X, Sparkles } from "lucide-react";
import { apiFetch } from "../lib/api";

export default function Dashboard() {
  const [activeDomain, setActiveDomain] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [activeCases, setActiveCases] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    customerId: "",
    meetingTranscript: "",
    crmNotes: "",
    emails: ""
  });
  
  const handleCreateCase = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await apiFetch("http://localhost:3005/api/cases", {
        method: "POST",
        body: {
          title: formData.title || "New Analysis Case",
          customerId: formData.customerId || "UNKNOWN",
          inputs: {
            meetingTranscript: formData.meetingTranscript,
            crmNotes: formData.crmNotes,
            emails: formData.emails
          }
        }
      });
      const newCase = await res.json();
      window.location.href = `/cases/${newCase._id}`;
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    apiFetch("http://localhost:3005/api/settings/active-domain")
      .then(res => res.json())
      .then(data => setActiveDomain(data))
      .catch(err => console.error(err));

    apiFetch("http://localhost:3005/api/analytics")
      .then(res => res.json())
      .then(data => setAnalytics(data))
      .catch(err => console.error(err));

    apiFetch("http://localhost:3005/api/cases")
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {activeDomain ? `${activeDomain.name} Hub` : "Executive Command Center"}
          </h1>
          <p className="text-muted-foreground mt-1 text-[15px]">
            Real-time agentic orchestration, pipeline execution metrics, and audit logs.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-md shadow-sm hover:bg-primary/90 transition-colors"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Analyze New Case
          </button>
        </div>
      </div>
      
      {analytics ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="glass-panel p-6 rounded-xl transition-shadow hover:shadow-md">
            <h3 className="tracking-widest text-[11px] font-bold uppercase text-muted-foreground mb-4">
              {activeDomain?.kpis?.metric1 || "Decisions Generated"}
            </h3>
            <div className="flex items-end justify-between">
              <div className="text-4xl font-semibold tracking-tight">{analytics.recommendationsGenerated}</div>
              <Activity className="h-5 w-5 text-muted-foreground mb-1" />
            </div>
          </div>
          <div className="glass-panel p-6 rounded-xl transition-shadow hover:shadow-md">
            <h3 className="tracking-widest text-[11px] font-bold uppercase text-muted-foreground mb-4">
              {activeDomain?.kpis?.metric2 || "Automation Rate"}
            </h3>
            <div className="flex items-end justify-between">
              <div className="text-4xl font-semibold tracking-tight text-emerald-600">{analytics.approvalRate}</div>
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mb-1" />
            </div>
          </div>
          <div className="glass-panel p-6 rounded-xl transition-shadow hover:shadow-md">
            <h3 className="tracking-widest text-[11px] font-bold uppercase text-muted-foreground mb-4">
              {activeDomain?.kpis?.metric3 || "AI Confidence"}
            </h3>
            <div className="flex items-end justify-between">
              <div className="text-4xl font-semibold tracking-tight">{analytics.averageConfidence}</div>
              <ShieldAlert className="h-5 w-5 text-muted-foreground mb-1" />
            </div>
          </div>
          <div className="glass-panel p-6 rounded-xl transition-shadow hover:shadow-md">
            <h3 className="tracking-widest text-[11px] font-bold uppercase text-muted-foreground mb-4">
              {activeDomain?.kpis?.metric4 || "Avg Latency"}
            </h3>
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
                <div className="text-[13px] text-muted-foreground truncate">{c.customerId} • Confidence {c.recommendation?.confidence || c.recommendation?.confidenceScore || 95}%</div>
              </Link>
            )) : (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground border border-dashed border-border rounded-lg bg-[#F9FAFB]">
                <p className="text-sm font-medium">All recommendations auto-approved.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-2xl rounded-xl shadow-lg border border-border flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold">Analyze New Case</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="createCaseForm" onSubmit={handleCreateCase} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Case Title</label>
                    <input required type="text" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="e.g. Q3 Renewal Risk" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Customer ID</label>
                    <input required type="text" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" placeholder="e.g. CUST-123" value={formData.customerId} onChange={e => setFormData({...formData, customerId: e.target.value})} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Meeting Transcript</label>
                  <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary min-h-[100px]" placeholder="Paste latest meeting transcript here..." value={formData.meetingTranscript} onChange={e => setFormData({...formData, meetingTranscript: e.target.value})} />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">CRM Notes (Account Health, Opportunity Value, etc.)</label>
                  <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px]" placeholder="Paste Salesforce/Hubspot notes here..." value={formData.crmNotes} onChange={e => setFormData({...formData, crmNotes: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Recent Email Threads</label>
                  <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px]" placeholder="Paste relevant customer emails here..." value={formData.emails} onChange={e => setFormData({...formData, emails: e.target.value})} />
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-border flex justify-end space-x-3 bg-muted/20">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium border border-input bg-background rounded-md hover:bg-muted">Cancel</button>
              <button type="submit" form="createCaseForm" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center">
                {isSubmitting ? "Orchestrating Agents..." : "Analyze Case"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
