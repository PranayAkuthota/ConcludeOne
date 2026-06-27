import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Plus, ChevronRight, FileText, X } from "lucide-react";

export default function Cases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    customerId: "",
    meetingTranscript: "",
    crmNotes: "",
    emails: ""
  });

  useEffect(() => {
    fetch("http://localhost:3005/api/cases")
      .then(res => res.json())
      .then(data => {
        setCases(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleCreateCase = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:3005/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title || "New Analysis Case",
          customerId: formData.customerId || "UNKNOWN",
          inputs: {
            meetingTranscript: formData.meetingTranscript,
            crmNotes: formData.crmNotes,
            emails: formData.emails
          }
        })
      });
      const newCase = await res.json();
      window.location.href = `/cases/${newCase._id}`;
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-border/50 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Cases</h1>
          <p className="text-muted-foreground mt-1 text-[15px]">
            Manage and view all customer analysis cases.
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-premium">
          <Plus className="mr-2 h-4 w-4" /> New Analysis Case
        </button>
      </div>

      <div className="rounded-lg border border-border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-[11px] uppercase tracking-wider bg-[#F9FAFB] border-b border-border text-muted-foreground font-bold">
            <tr>
              <th className="px-6 py-4 font-medium">Case Title</th>
              <th className="px-6 py-4 font-medium">Customer ID</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="px-6 py-8 text-center text-muted-foreground">Loading cases...</td></tr>
            ) : cases.length === 0 ? (
              <tr><td colSpan="4" className="px-6 py-8 text-center text-muted-foreground">No cases found. Create a new case to start.</td></tr>
            ) : (
              cases.reverse().map((c) => (
                <tr key={c._id} className="border-b border-border/50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="truncate text-[14px] text-foreground font-semibold">{c.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-[13px]">{c.customerId}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-[11px] font-bold uppercase tracking-wider border ${
                      c.status === 'Completed' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                        : c.status === 'Requires Approval' 
                          ? 'bg-amber-50 text-amber-700 border-amber-300' 
                          : 'bg-blue-50 text-blue-700 border-blue-300'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/cases/${c._id}`} className="inline-flex items-center text-[13px] font-semibold text-primary hover:underline">
                      View Details <ChevronRight className="ml-1 h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-2xl rounded-xl shadow-lg border border-border flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold">Create New Analysis Case</h2>
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
