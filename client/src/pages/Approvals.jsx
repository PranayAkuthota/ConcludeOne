import { useState, useEffect } from "react";
import { ShieldAlert, CheckCircle2, XCircle, Edit, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export default function Approvals() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovals = () => {
    fetch("http://localhost:3005/api/cases")
      .then(res => res.json())
      .then(data => {
        setCases(data.filter(c => c.status === 'Requires Approval'));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleApprove = async (caseId) => {
    try {
      await fetch(`http://localhost:3005/api/approvals/${caseId}/approve`, {
        method: "POST"
      });
      fetchApprovals();
    } catch(e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading approval queue...</div>;

  return (
    <div className="space-y-10 pb-12 max-w-5xl mx-auto">
      <div className="border-b border-border/50 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Approvals Queue</h1>
        <p className="text-muted-foreground mt-1 text-[15px]">
          Human-in-the-loop review queue for AI recommendations.
        </p>
      </div>
      
      <div className="grid gap-6">
        {cases.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-[#F9FAFB] p-16 text-center flex flex-col items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 mb-4 opacity-80" />
            <h3 className="text-lg font-bold tracking-tight text-foreground">All caught up!</h3>
            <p className="text-muted-foreground mt-1 text-sm">There are no pending recommendations requiring your approval.</p>
          </div>
        ) : (
          cases.map(c => (
            <div key={c._id} className="glass-panel p-0 rounded-xl flex flex-col">
              <div className="p-6 bg-[#F9FAFB] border-b border-border/50 flex justify-between items-center rounded-t-xl">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-semibold text-[15px]">{c.title}</h3>
                    <p className="text-[13px] text-muted-foreground mt-0.5">Customer: {c.customerId}</p>
                  </div>
                </div>
                <Link to={`/cases/${c._id}`} className="inline-flex items-center text-[13px] font-semibold text-primary hover:underline">
                  View Full Case Details
                </Link>
              </div>
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-3">
                    <ShieldAlert className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <div>
                      <span className="font-bold text-[11px] uppercase tracking-widest text-muted-foreground block mb-1">Suggested Action</span>
                      <span className="text-xl font-bold text-foreground">{c.recommendation?.nextBestAction}</span>
                    </div>
                  </div>
                  <div className="text-right">
                     <span className="font-bold text-[11px] uppercase tracking-widest text-muted-foreground block mb-1">Confidence</span>
                     <span className="text-xl font-bold text-emerald-600">{c.recommendation?.confidenceScore || 92}%</span>
                  </div>
                </div>
                <p className="text-[14px] leading-relaxed text-muted-foreground mb-8 pl-8 border-l-2 border-border/50 ml-1 py-1">
                  {c.recommendation?.businessReasoning}
                </p>
                
                <div className="flex space-x-3 pl-8">
                  <button onClick={() => handleApprove(c._id)} className="inline-flex items-center justify-center rounded-md text-[13px] font-semibold transition-colors bg-emerald-600 text-white hover:bg-emerald-700 h-9 px-4 py-2 cursor-pointer shadow-sm active:scale-95">
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Approve & Execute
                  </button>
                  <button className="inline-flex items-center justify-center rounded-md text-[13px] font-semibold transition-colors border border-border bg-white hover:bg-gray-50 h-9 px-4 py-2 text-destructive cursor-pointer shadow-sm active:scale-95">
                    <XCircle className="mr-2 h-4 w-4" /> Reject
                  </button>
                  <button className="inline-flex items-center justify-center rounded-md text-[13px] font-semibold transition-colors border border-border bg-white hover:bg-gray-50 h-9 px-4 py-2 text-foreground cursor-pointer shadow-sm active:scale-95">
                    <Edit className="mr-2 h-4 w-4" /> Modify Action
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
