import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, AlertTriangle, ShieldAlert, Cpu, FileText, ArrowLeft, BrainCircuit, History, Database, BookOpen } from "lucide-react";
import ExecutionGraph from "../components/ExecutionGraph";

export default function CaseDetail() {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCase = () => {
      fetch(`http://localhost:3005/api/cases/${id}`)
        .then(res => res.json())
        .then(data => {
          setCaseData(data);
          setLoading(false);
          if (data.status === 'Processing') {
            setTimeout(fetchCase, 2000);
          }
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    };
    fetchCase();
  }, [id]);

  if (loading) return <div className="p-12 text-center text-muted-foreground animate-pulse">Loading enterprise context...</div>;
  if (!caseData) return <div className="p-12 text-center text-destructive">Case not found.</div>;

  // Render context safely
  const renderContextCards = () => {
    if (!caseData.enterpriseContext) return <p className="text-sm text-muted-foreground">No enterprise context loaded.</p>;
    
    // Extract the text content from the object or string
    let contextStr = "";
    if (typeof caseData.enterpriseContext === 'string') {
      contextStr = caseData.enterpriseContext;
    } else if (caseData.enterpriseContext.playbookSummary) {
      contextStr = caseData.enterpriseContext.playbookSummary;
    } else {
      contextStr = JSON.stringify(caseData.enterpriseContext);
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel p-4 rounded-xl border-l-4 border-indigo-500 hover:-translate-y-1 transition-transform">
          <div className="flex items-center mb-2">
            <BookOpen className="h-4 w-4 text-indigo-500 mr-2" />
            <h4 className="font-semibold text-sm">Enterprise Synthesis</h4>
          </div>
          <p className="text-xs text-muted-foreground whitespace-pre-wrap line-clamp-6">{contextStr}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10 animate-fade-in pb-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border/50 pb-6">
        <div>
          <Link to="/cases" className="text-[13px] font-semibold text-muted-foreground hover:text-primary flex items-center mb-4 transition-colors">
            <ArrowLeft className="h-3 w-3 mr-1" /> Back to Cases
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{caseData.title}</h1>
          <div className="flex items-center mt-2 space-x-4 text-[13px] font-medium">
            <span className="text-muted-foreground flex items-center">
              <Database className="h-4 w-4 mr-1.5 opacity-70" /> {caseData.customerId}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-[11px] font-bold uppercase tracking-wider border ${
              caseData.status === 'Completed' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                : caseData.status === 'Requires Approval' 
                  ? 'bg-amber-50 text-amber-700 border-amber-300' 
                  : 'bg-blue-50 text-blue-700 border-blue-300 animate-pulse'
            }`}>
              {caseData.status}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full">
        <ExecutionGraph logs={caseData.agentLogs} status={caseData.status} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          
          {/* Recommendation Block */}
          {caseData.recommendation ? (
            <div className="glass-panel rounded-xl overflow-hidden shadow-sm flex flex-col p-0">
              <div className="p-8 bg-[#F9FAFB] border-b border-border/50 flex justify-between items-start rounded-t-xl">
                <div className="max-w-xl">
                  <h2 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center">
                    <ShieldAlert className="mr-2 h-4 w-4" /> Next Best Action
                  </h2>
                  <div className="text-[15px] font-bold leading-snug text-foreground text-balance pr-4">
                    {caseData.recommendation.nextBestAction}
                  </div>
                </div>
                <div className="flex flex-col items-end text-right">
                  <span className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold mb-2">AI Confidence</span>
                  <div className="text-3xl font-bold text-emerald-600">{caseData.recommendation.confidenceScore || 92}%</div>
                </div>
              </div>
              <div className="p-8 space-y-8 bg-white rounded-b-xl">
                <div>
                  <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Business Reasoning</h3>
                  <p className="text-[14px] leading-relaxed text-foreground/90 font-medium border-l-2 border-border/50 pl-4 py-1">{caseData.recommendation.businessReasoning}</p>
                </div>
                {caseData.recommendation.evidence && caseData.recommendation.evidence.length > 0 && (
                  <div>
                    <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3 mt-6">Supporting Evidence</h3>
                    <ul className="space-y-2">
                      {caseData.recommendation.evidence.map((ev, i) => (
                        <li key={i} className="text-[13px] flex items-start p-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 mr-3 shrink-0 mt-0.5" />
                          <span className="text-foreground font-medium">{ev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-xl p-16 text-center flex flex-col items-center justify-center space-y-6 bg-[#F9FAFB]">
              <BrainCircuit className="h-10 w-10 text-primary opacity-50 animate-pulse" />
              <div>
                <p className="text-lg font-bold">Agents are reasoning...</p>
                <p className="text-[13px] text-muted-foreground mt-2">Evaluating enterprise context and past memory.</p>
              </div>
            </div>
          )}

          {/* Enterprise Context Cards */}
          <div className="space-y-6 mt-10">
             <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center">
                <Database className="mr-2 h-4 w-4" /> Enterprise Context Used
             </h2>
             {renderContextCards()}
          </div>
        </div>

        <div className="space-y-6">
           {/* Reasoning Memory Timeline */}
           <div className="glass-panel rounded-xl p-6">
              <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center mb-6">
                <History className="mr-2 h-4 w-4" /> Reasoning Memory
              </h2>
              {caseData.historicalMemory ? (
                <div className="relative border-l border-border/50 ml-3 pl-6 space-y-6">
                  {caseData.historicalMemory.split('--- Case').filter(Boolean).map((block, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-white" />
                      <div className="text-[13px] text-muted-foreground whitespace-pre-wrap">{block.trim()}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-muted-foreground italic">No historical interactions influenced this decision.</p>
              )}
           </div>

           {/* Raw Inputs */}
           <div className="glass-panel rounded-xl p-6">
              <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center mb-4">
                 <FileText className="mr-2 h-4 w-4" /> Raw Transcript
              </h2>
              <div className="bg-[#F9FAFB] p-4 rounded-md text-[11px] text-muted-foreground whitespace-pre-wrap font-mono max-h-64 overflow-y-auto border border-border/50">
                {caseData.inputs?.meetingTranscript || "No transcript provided."}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
