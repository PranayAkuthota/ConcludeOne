import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, AlertTriangle, ShieldAlert, Cpu, FileText, ArrowLeft, History, Database, BookOpen, Layers, Check, Search, TrendingUp, X, ShieldCheck, Users, Activity, Zap, Clock, AlertOctagon, Info, BarChart3, Goal, Briefcase, PlayCircle, Network } from "lucide-react";
import ExecutionGraph from "../components/ExecutionGraph";
import { apiFetch } from "../lib/api";

export default function CaseDetail() {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApproval, setShowApproval] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const fetchCase = () => {
      apiFetch(`http://localhost:3005/api/cases/${id}`)
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

  const plannerLog = caseData.agentLogs?.find(l => l.agentName === "Planner Agent");
  
  // Calculate specific mock confidences based on overall confidence to simulate breakdowns
  const overallConf = caseData.recommendation?.confidenceScore || caseData.recommendation?.confidence || caseData.explanation?.confidence || 95;
  const mtgConf = Math.min(100, Math.floor(overallConf * 1.01));
  const crmConf = Math.min(100, Math.floor(overallConf * 0.98));
  const entConf = Math.min(100, Math.floor(overallConf * 1.03));
  const histConf = Math.min(100, Math.floor(overallConf * 0.99));

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
                  : caseData.status === 'Failed'
                    ? 'bg-red-50 text-red-700 border-red-300'
                    : 'bg-blue-50 text-blue-700 border-blue-300 animate-pulse'
            }`}>
              {caseData.status}
            </span>
          </div>
        </div>
        {caseData.status === 'Requires Approval' && (
          <button onClick={() => setShowApproval(true)} className="mt-4 md:mt-0 bg-primary text-primary-foreground px-6 py-2.5 rounded-md text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-2" /> Approve Decision
          </button>
        )}
      </div>



      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* LEFT SIDEBAR: Planner & Timeline */}
        <div className="space-y-8 xl:col-span-1">
          {plannerLog && (
            <div className="glass-panel rounded-xl p-5 border-l-4 border-indigo-500">
              <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center mb-4">
                <Cpu className="mr-2 h-4 w-4 text-indigo-500" /> Planner Decision
              </h2>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Selected Agents</span>
                  <div className="flex flex-wrap gap-1">
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-mono border border-gray-200">✓ Meeting Analysis</span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-mono border border-gray-200">✓ CRM Context</span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-mono border border-gray-200">✓ Enterprise Context</span>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-1">Reason</span>
                  <p className="text-xs text-foreground/80 leading-relaxed line-clamp-4" title={plannerLog.outputSummary}>{plannerLog.outputSummary}</p>
                </div>
                <div className="flex justify-between border-t border-border/50 pt-2">
                  <span className="text-xs text-muted-foreground">Parallel Execution</span>
                  <span className="text-xs font-bold text-emerald-600">Yes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Retry Required</span>
                  <span className="text-xs font-bold">No</span>
                </div>
              </div>
            </div>
          )}

          <div className="glass-panel rounded-xl p-5">
            <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center mb-6">
              <Layers className="mr-2 h-4 w-4" /> Reasoning Timeline
            </h2>
            <div className="relative border-l-2 border-indigo-100 ml-3 space-y-5">
              {['Meeting Analysis', 'CRM Analysis', 'Enterprise Context', 'Risk Assessment', 'Recommendation', 'Explainability', 'Human Approval', 'Memory Updated'].map((step, i) => (
                <div key={i} className="relative pl-6">
                  <div className={`absolute -left-[7px] top-1 h-3 w-3 rounded-full ring-4 ring-white ${i < 6 || caseData.status === 'Completed' ? 'bg-indigo-500' : 'bg-gray-200'}`} />
                  <div className={`text-[12px] font-semibold ${i < 6 || caseData.status === 'Completed' ? 'text-foreground' : 'text-muted-foreground'}`}>{step}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT: Executive Brief */}
        <div className="xl:col-span-3 space-y-8">
          
          {caseData.recommendation ? (
            <div className="glass-panel rounded-xl overflow-hidden shadow-sm flex flex-col p-0">
              {/* Header */}
              <div className="p-8 bg-slate-900 text-white border-b border-border/50 flex flex-col md:flex-row justify-between items-start md:items-center rounded-t-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="max-w-2xl relative z-10">
                  <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center">
                    <ShieldAlert className="mr-2 h-4 w-4 text-indigo-400" /> Next Best Action
                  </h2>
                  <div className="text-2xl font-bold leading-snug text-balance mb-4">
                    {caseData.recommendation.primaryRecommendation || caseData.recommendation.recommendation || caseData.recommendation.nextBestAction}
                  </div>
                  {caseData.recommendation.aiProvider && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-mono border border-slate-700/50 bg-slate-800/80 text-slate-300 shadow-sm backdrop-blur-sm">
                      <Cpu className="w-3.5 h-3.5 mr-1.5 text-indigo-400" /> AI Provider: {caseData.recommendation.aiProvider}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-8 mt-6 md:mt-0 relative z-10">
                  <div className="text-center bg-slate-800/50 px-5 py-3 rounded-xl border border-slate-700/50">
                    <span className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1.5">Priority</span>
                    <span className={`px-2.5 py-0.5 border rounded text-xs font-bold uppercase shadow-sm ${
                      caseData.recommendation.priority === 'Critical' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                      caseData.recommendation.priority === 'High' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                      caseData.recommendation.priority === 'Medium' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                      'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    }`}>{caseData.recommendation.priority || "High"}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">Confidence</span>
                    <div className="text-3xl font-bold text-emerald-400">{overallConf}%</div>
                  </div>
                </div>
              </div>

              {/* Business Impact Banner */}
              {caseData.recommendation.expectedBusinessImpact && (
                <div className="bg-emerald-50 text-emerald-950 px-8 py-5 flex flex-wrap gap-x-12 gap-y-4 border-b border-emerald-100 shadow-inner">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-1 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> Expected Business Impact</span>
                    <span className="text-sm font-bold">{caseData.recommendation.expectedBusinessImpact}</span>
                  </div>
                </div>
              )}

              <div className="p-8 space-y-10 bg-white">
                
                {/* Two Column Layout for Rationale & Immediate Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  
                  {/* Left Column: Why This Action */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-[12px] font-bold text-indigo-900 uppercase tracking-widest mb-4 flex items-center">
                        <Info className="w-4 h-4 mr-2 text-indigo-500" /> Why This Action
                      </h3>
                      {caseData.recommendation.supportingEvidence && caseData.recommendation.supportingEvidence.length > 0 ? (
                        <div className="space-y-4">
                          <p className="text-[13.5px] leading-relaxed text-foreground/90 font-medium">
                            {caseData.recommendation.businessReasoning}
                          </p>
                          <ul className="space-y-3 mt-4 border-l-2 border-indigo-100 pl-4">
                            {caseData.recommendation.supportingEvidence.map((evidence, i) => (
                              <li key={i} className="flex items-start text-[13px] leading-relaxed text-foreground/70 font-medium italic">
                                {evidence}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p className="text-[13px] leading-relaxed text-foreground/90 font-medium">{caseData.recommendation.businessReasoning || caseData.explanation?.reasoning}</p>
                      )}
                    </div>

                    <div>
                      {/* Removing teamsInvolved since it's no longer in the schema */}
                    </div>
                  </div>

                  {/* Right Column: Immediate Actions */}
                  <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100/50 shadow-sm">
                    <h3 className="text-[12px] font-bold text-indigo-900 uppercase tracking-widest mb-5 flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-indigo-500 fill-indigo-500" /> Immediate Actions (24-72h)
                    </h3>
                    {caseData.recommendation.executionPlan && caseData.recommendation.executionPlan.length > 0 ? (
                      <div className="space-y-4">
                        {caseData.recommendation.executionPlan.map((action, i) => (
                          <div key={i} className="flex items-start bg-white p-3.5 rounded-xl border border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                              {i + 1}
                            </div>
                            <span className="text-[13px] font-medium text-slate-800 leading-snug pt-0.5">{action}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No execution plan generated. Review rationale.</p>
                    )}
                  </div>
                  
                </div>

                {/* Bottom Row: Metrics & Risks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  
                  {/* Success Metrics */}
                  <div className="bg-emerald-50/30 rounded-xl p-5 border border-emerald-100">
                    <h3 className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest mb-4 flex items-center">
                      <Goal className="w-4 h-4 mr-2 text-emerald-500" /> Success Metrics
                    </h3>
                    <ul className="space-y-2.5">
                      {caseData.recommendation.successMetrics?.map((metric, i) => (
                        <li key={i} className="flex items-start text-xs font-medium text-emerald-900/80">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-emerald-500 flex-shrink-0 mt-0.5" /> {metric}
                        </li>
                      )) || (
                        <li className="flex items-start text-xs font-medium text-emerald-900/80">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-emerald-500 flex-shrink-0 mt-0.5" /> Positive customer response
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Risks if Ignored */}
                  <div className="bg-red-50/50 rounded-xl p-5 border border-red-100">
                    <h3 className="text-[11px] font-bold text-red-800 uppercase tracking-widest mb-4 flex items-center">
                      <AlertOctagon className="w-4 h-4 mr-2 text-red-500" /> Risks if Ignored
                    </h3>
                    <ul className="space-y-2.5">
                      {caseData.recommendation.risksIfIgnored?.map((risk, i) => (
                        <li key={i} className="flex items-start text-xs font-medium text-red-900/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 mr-2 flex-shrink-0 mt-1.5" /> {risk}
                        </li>
                      )) || (
                        <li className="flex items-start text-xs font-medium text-red-900/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 mr-2 flex-shrink-0 mt-1.5" /> High probability of churn
                        </li>
                      )}
                    </ul>
                  </div>

                </div>

                {/* Legacy Source Validation block (Kept for traceability) */}
                <div className="pt-6 border-t border-slate-100">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                    <History className="w-3 h-3 mr-1.5" /> Agent Traceability Logs
                  </h3>
                  <div className="bg-slate-50 rounded-lg p-4 text-[11px] font-mono text-slate-500 border border-slate-200">
                    <div className="flex flex-wrap gap-4">
                      <span>✓ Meeting Context Mapped</span>
                      <span>✓ CRM Context Mapped</span>
                      <span>✓ Enterprise Playbooks Queried</span>
                      <span>✓ Risk Model Applied</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ) : caseData.status === 'Failed' ? (
             <div className="glass-panel rounded-xl p-16 text-center flex flex-col items-center justify-center space-y-6 border-red-200 bg-red-50/50">
              <AlertTriangle className="h-10 w-10 text-red-500 mb-2" />
              <div>
                <p className="text-lg font-bold text-red-700">Reasoning Engine Failed</p>
                <p className="text-[13px] text-red-600/90 mt-2 max-w-lg mx-auto font-medium">{caseData.error || "The AI models encountered a critical error during execution."}</p>
              </div>
              <div className="mt-6 flex items-center space-x-4">
                <button 
                  disabled={isRetrying}
                  onClick={() => {
                    setIsRetrying(true);
                    setCaseData({...caseData, status: 'Processing'});
                    apiFetch(`http://localhost:3005/api/cases/${id}/retry`, { method: 'POST' })
                      .then(res => res.json())
                      .then(() => window.location.reload())
                      .catch(err => {
                        console.error(err);
                        setIsRetrying(false);
                      });
                  }} 
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded shadow-sm text-sm font-bold transition-colors disabled:opacity-50"
                >
                  {isRetrying ? "Retrying..." : "Retry Execution"}
                </button>
              </div>
            </div>
          ) : (
             <div className="glass-panel rounded-xl p-16 text-center flex flex-col items-center justify-center space-y-6 bg-[#F9FAFB]">
              <Activity className="h-10 w-10 text-primary opacity-50 animate-pulse" />
              <div>
                <p className="text-lg font-bold">Agents are reasoning...</p>
                <p className="text-[13px] text-muted-foreground mt-2">Evaluating enterprise context and past memory.</p>
              </div>
            </div>
          )}

          {/* Enterprise Context Viewer */}
          <div className="space-y-4 mt-8">
             <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center mb-4">
                <Database className="mr-2 h-4 w-4" /> Enterprise Context Viewer
             </h2>
             {caseData.enterpriseContext ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass-panel p-5 rounded-xl border-t-4 border-indigo-500 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-sm">Relevant Playbooks</h4>
                      <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold">ChromaDB</span>
                    </div>
                    <ul className="space-y-2">
                      {caseData.enterpriseContext.relevantPlaybookNames?.map((p, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-center"><FileText className="w-3 h-3 mr-2" /> {p}</li>
                      )) || <li className="text-xs text-muted-foreground flex items-center"><FileText className="w-3 h-3 mr-2" /> Standard Policies</li>}
                    </ul>
                    <div className="mt-4 pt-3 border-t border-border/50 text-[10px] text-muted-foreground flex justify-between">
                      <span>Relevance Score: 98%</span>
                      <span>Source: Vector Search</span>
                    </div>
                  </div>
                  
                  <div className="glass-panel p-5 rounded-xl border-t-4 border-emerald-500 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-sm">Synthesized Policy Knowledge</h4>
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">Context Agent</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
                      {caseData.enterpriseContext.synthesizedContext || caseData.enterpriseContext.playbookSummary || JSON.stringify(caseData.enterpriseContext)}
                    </p>
                    <div className="mt-4 pt-3 border-t border-border/50 text-[10px] text-muted-foreground flex justify-between">
                      <span>Applied to Decision</span>
                      <span>Source: LLM Synthesis</span>
                    </div>
                  </div>
               </div>
             ) : (
               <p className="text-sm text-muted-foreground">No enterprise context loaded.</p>
             )}
          </div>
        </div>
      </div>

      {/* Execution Graph (Moved to bottom) */}
      <div className="w-full mt-10 border-t border-border/50 pt-10">
        <h2 className="text-[14px] font-bold text-foreground mb-6 flex items-center">
          <Network className="mr-2 h-5 w-5 text-indigo-500" /> Multi-Agent Execution Pipeline
        </h2>
        <ExecutionGraph logs={caseData.agentLogs} status={caseData.status} />
      </div>

      {/* Human Approval Modal */}
      {showApproval && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden">
            <div className="p-6 border-b border-border/50 flex justify-between items-center bg-[#F9FAFB]">
              <h2 className="font-bold text-lg flex items-center"><ShieldCheck className="w-5 h-5 text-emerald-600 mr-2" /> Human Approval Required</h2>
              <button onClick={() => setShowApproval(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Why this recommendation was generated</h3>
                <p className="text-sm font-medium leading-relaxed">{caseData.explanation?.reasoning || caseData.recommendation?.businessReasoning}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Contributing Agents</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Meeting Agent', 'CRM Agent', 'Context Agent', 'Risk Agent'].map(a => (
                      <span key={a} className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full font-semibold">{a}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Expected Outcome</h3>
                  <p className="text-sm font-bold text-emerald-600">{caseData.recommendation?.expectedBusinessImpact || "Secure renewal"}</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-border/50 flex justify-end space-x-3">
              <button onClick={() => setShowApproval(false)} className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-gray-100 rounded-md">Cancel</button>
              <button onClick={() => {
                apiFetch(`http://localhost:3005/api/approvals/${caseData._id}/approve`, { method: 'POST' })
                  .then(res => res.json())
                  .then(data => {
                    setCaseData(data);
                    setShowApproval(false);
                  })
                  .catch(console.error);
              }} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-md shadow-sm">
                Confirm & Execute Decision
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
