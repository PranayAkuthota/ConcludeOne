import { Link } from "react-router-dom";
import { BrainCircuit, Bot, ShieldCheck, ChevronRight, Activity, Cpu, Database, CheckSquare, Network } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-foreground font-sans flex flex-col justify-between overflow-x-hidden">
      {/* Header / Navigation */}
      <header className="border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="text-base font-bold tracking-tight uppercase">Conclude One</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#orchestration" className="hover:text-foreground transition-colors">Multi-Agent RAG</a>
            <a href="#security" className="hover:text-foreground transition-colors">Decision Risk</a>
          </nav>
          <div className="flex items-center space-x-4">
            <Link to="/signin" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5">
              Sign In
            </Link>
            <Link to="/signup" className="inline-flex items-center justify-center rounded-md text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 shadow-sm transition-all active:scale-95">
              Create Account
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative px-6 pt-20 pb-24 overflow-hidden border-b border-border bg-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-6 space-y-6 animate-fade-in">
              <div className="inline-flex items-center space-x-2 bg-muted px-3 py-1 rounded-full text-xs font-semibold text-muted-foreground">
                <Bot className="h-3.5 w-3.5" />
                <span>LangGraph-Powered Multi-Agent Workflows</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                Enterprise Decision <br />
                <span className="text-muted-foreground">Intelligence Platform</span>
              </h1>
              <p className="text-base text-muted-foreground max-w-lg leading-relaxed">
                Coordinate specialized AI agents (Meeting, CRM, context, risk, and explainability) to ingest customer context and synthesize actionable executive briefs.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <Link to="/signup" className="inline-flex items-center justify-center rounded-md text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 shadow-md transition-all active:scale-95">
                  Get Started Free <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
                <a href="#features" className="inline-flex items-center justify-center rounded-md text-sm font-semibold border border-border bg-[#F9FAFB] text-foreground hover:bg-muted px-6 py-3 transition-colors">
                  Explore Features
                </a>
              </div>
            </div>

            {/* Right Hero Interface Mockup */}
            <div className="lg:col-span-6 animate-slide-up">
              <div className="glass-panel rounded-xl overflow-hidden border border-border bg-[#F9FAFB] shadow-elevated">
                {/* Mock Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-white">
                  <div className="flex items-center space-x-1.5">
                    <span className="h-3.5 w-3.5 rounded-full bg-[#E4E4E7]" />
                    <span className="h-3.5 w-3.5 rounded-full bg-[#E4E4E7]" />
                    <span className="h-3.5 w-3.5 rounded-full bg-[#E4E4E7]" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded">langgraph-workflow-viz</span>
                </div>
                {/* Mock Graph Visualization */}
                <div className="p-6 space-y-4">
                  {/* Step 1: Input */}
                  <div className="flex items-center justify-between bg-white border border-border p-3 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                        <Cpu className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="text-[12px] font-bold text-foreground">1. Planner Agent</div>
                        <div className="text-[10px] text-muted-foreground">Dynamic Routing Decision</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Active</span>
                  </div>

                  {/* Arrow Connectors */}
                  <div className="flex justify-around items-center h-6 text-muted-foreground/30">
                    <div className="w-0.5 h-full bg-dashed border-l border-border" />
                    <div className="w-0.5 h-full bg-dashed border-l border-border" />
                    <div className="w-0.5 h-full bg-dashed border-l border-border" />
                  </div>

                  {/* Parallel Agents */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white border border-border p-2.5 rounded-lg shadow-sm flex flex-col items-center justify-center text-center">
                      <Bot className="h-4 w-4 text-muted-foreground mb-1" />
                      <span className="text-[10px] font-bold">Meeting Agent</span>
                      <span className="text-[8px] text-emerald-600 font-semibold">sentiment = objection</span>
                    </div>
                    <div className="bg-white border border-border p-2.5 rounded-lg shadow-sm flex flex-col items-center justify-center text-center">
                      <Database className="h-4 w-4 text-muted-foreground mb-1" />
                      <span className="text-[10px] font-bold">CRM Agent</span>
                      <span className="text-[8px] text-muted-foreground">$150k ARR at Risk</span>
                    </div>
                    <div className="bg-white border border-border p-2.5 rounded-lg shadow-sm flex flex-col items-center justify-center text-center">
                      <Network className="h-4 w-4 text-muted-foreground mb-1" />
                      <span className="text-[10px] font-bold">RAG Agent</span>
                      <span className="text-[8px] text-muted-foreground">Pricing Policy Loaded</span>
                    </div>
                  </div>

                  {/* Arrow Connectors */}
                  <div className="flex justify-center items-center h-6 text-muted-foreground/30">
                    <div className="w-0.5 h-full bg-dashed border-l border-border" />
                  </div>

                  {/* Final Decision */}
                  <div className="bg-white border border-border p-3 rounded-lg shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-white">
                          <CheckSquare className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-[12px] font-bold text-foreground">Decision Brief Synthesis</div>
                          <div className="text-[10px] text-emerald-600 font-medium">96% confidence score</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Completed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Structured Decision Intelligence</h2>
            <p className="text-sm text-muted-foreground mt-3">Synthesizing fragmented sales data and playbook context into single next best actions.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-border p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <Bot className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-lg font-bold text-foreground">Orchestrated State Machine</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Deterministic execution paths coordinate context gathering, risk assessment, recommendation, and memory compilation.
              </p>
            </div>
            <div className="bg-white border border-border p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <Activity className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-lg font-bold text-foreground">Quantitative Risk Engine</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Calculates numerical scores for Deal Risk and Churn Risk to calibrate priorities before synthesizing actions.
              </p>
            </div>
            <div className="bg-white border border-border p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <ShieldCheck className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-lg font-bold text-foreground">Reasoning Memory Persistence</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Approved business recommendations are written to MongoDB long-term memory for contextual injection in future workflows.
              </p>
            </div>
          </div>
        </section>

        {/* Multi-Agent RAG Section */}
        <section id="orchestration" className="bg-white border-t border-b border-border/60 py-20 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Multi-Agent RAG & Document Retrieval</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Connect your business playbooks, standard operational guidelines, and pricing charts. Conclude One queries a secure local vector store (ChromaDB) to inject hyper-specific policy guardrails directly into the agent reasoning context.
              </p>
              <ul className="space-y-3 text-sm font-semibold text-slate-700">
                <li className="flex items-center"><CheckSquare className="h-4 w-4 text-emerald-500 mr-2" /> Synced Salesforce & HubSpot CRM profiles</li>
                <li className="flex items-center"><CheckSquare className="h-4 w-4 text-emerald-500 mr-2" /> Automated compliance & discount policy matching</li>
                <li className="flex items-center"><CheckSquare className="h-4 w-4 text-emerald-500 mr-2" /> Dynamic context routing based on customer sentiment</li>
              </ul>
            </div>
            <div className="lg:col-span-6">
              <div className="glass-panel p-6 rounded-xl bg-[#F9FAFB] border border-border/80 shadow-sm space-y-4">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Active Vector Stores</span>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-white rounded border border-border/50">
                    <span className="text-xs font-bold text-slate-800">Product Specifications Docs</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">1,200 Vectors</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded border border-border/50">
                    <span className="text-xs font-bold text-slate-800">Enterprise Pricing Playbooks</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">12 Playbooks</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded border border-border/50">
                    <span className="text-xs font-bold text-slate-800">Commercial Concession Limits</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">45 Policies</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Decision Risk Section */}
        <section id="security" className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 order-last lg:order-first">
              <div className="glass-panel p-6 rounded-xl bg-white border border-border/80 shadow-sm space-y-4">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Deal Risk Evaluator</span>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Contract Renewal Health</span>
                      <span className="text-emerald-600">92%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Competitor Pressure Churn Risk</span>
                      <span className="text-rose-600">14%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: '14%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Quantitative Decision Risk Engines</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our Risk Assessor Agent assigns numerical weights to critical business threats by parsing account records. Calculate renewal safety factors and compliance issues before formulating proposed deal concessions.
              </p>
              <ul className="space-y-3 text-sm font-semibold text-slate-700">
                <li className="flex items-center"><CheckSquare className="h-4 w-4 text-indigo-500 mr-2" /> Live churn prediction matrix models</li>
                <li className="flex items-center"><CheckSquare className="h-4 w-4 text-indigo-500 mr-2" /> Competitor evaluation detection from call transcripts</li>
                <li className="flex items-center"><CheckSquare className="h-4 w-4 text-indigo-500 mr-2" /> Transparent agent confidence scores on every case</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-white px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <BrainCircuit className="h-4 w-4 text-primary" />
            <span className="font-bold tracking-tight uppercase text-foreground">Conclude One</span>
          </div>
          <p>© 2026 Conclude One. All rights reserved. Built for modern enterprise decision intelligence.</p>
        </div>
      </footer>
    </div>
  );
}
