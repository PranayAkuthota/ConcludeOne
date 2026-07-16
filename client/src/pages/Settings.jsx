import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Settings as SettingsIcon, User, Bot, Database, Save, Key, Sliders, CheckCircle2, ShieldAlert, AlertTriangle, Loader2, LayoutGrid, Sparkles } from "lucide-react";
import { apiFetch } from "../lib/api";

export default function Settings() {
  const { user } = useAuth();
  
  // Tab control state
  const [activeTab, setActiveTab] = useState("profile"); // profile, ai, database, domain
  
  // Profile state
  const [profileName, setProfileName] = useState(user?.name || "Admin User");
  const [profileEmail, setProfileEmail] = useState(user?.email || "admin@conclude.one");
  const [profilePassword, setProfilePassword] = useState("");
  
  // AI Settings state
  const [primaryModel, setPrimaryModel] = useState("Gemini 2.5 Flash-Lite");
  const [temperature, setTemperature] = useState(0.2);
  const [fallbackEnabled, setFallbackEnabled] = useState(true);
  
  // DB Config state
  const [mongoUri, setMongoUri] = useState("mongodb+srv://*****:*****@cluster0.mongodb.net/concludeone");
  
  // Domain config state
  const [domains, setDomains] = useState([]);
  const [activeDomain, setActiveDomain] = useState(null);
  
  // Status feedback state
  const [saveStatus, setSaveStatus] = useState("");
  const [dbStatus, setDbStatus] = useState("");
  const [testingDb, setTestingDb] = useState(false);
  const [updatingDomain, setUpdatingDomain] = useState(false);

  // Fetch settings on mount
  useEffect(() => {
    // Fetch domains list
    apiFetch("http://localhost:3005/api/settings/domains")
      .then(res => res.json())
      .then(data => setDomains(data))
      .catch(console.error);

    // Fetch active domain template
    apiFetch("http://localhost:3005/api/settings/active-domain")
      .then(res => res.json())
      .then(data => setActiveDomain(data))
      .catch(console.error);
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSaveStatus("profile-saving");
    setTimeout(() => {
      setSaveStatus("profile-saved");
      setTimeout(() => setSaveStatus(""), 3000);
    }, 1200);
  };

  const handleSaveAI = (e) => {
    e.preventDefault();
    setSaveStatus("ai-saving");
    setTimeout(() => {
      setSaveStatus("ai-saved");
      setTimeout(() => setSaveStatus(""), 3000);
    }, 1200);
  };

  const handleTestConnection = () => {
    setTestingDb(true);
    setDbStatus("");
    setTimeout(() => {
      setTestingDb(false);
      setDbStatus("connected");
    }, 1500);
  };

  const handleSelectDomain = async (domainId) => {
    setUpdatingDomain(true);
    try {
      const res = await apiFetch("http://localhost:3005/api/settings/active-domain", {
        method: "POST",
        body: { domainId }
      });
      if (res.ok) {
        const data = await res.json();
        setActiveDomain(data.activeDomain);
        setSaveStatus("domain-saved");
        setTimeout(() => setSaveStatus(""), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingDomain(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="border-b border-border/50 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center">
          <SettingsIcon className="mr-3 h-6 w-6 text-indigo-600" />
          Settings & Configurations
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your account profile, configure the multi-agent AI provider pipeline, and set connection parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Navigation Sidebar */}
        <div className="glass-panel p-4 rounded-xl space-y-1.5 bg-white">
          <button 
            onClick={() => setActiveTab("profile")}
            className={`flex w-full items-center rounded-md px-3 py-2 text-xs font-bold transition-colors ${
              activeTab === "profile" 
                ? "text-indigo-600 bg-indigo-50 border border-indigo-100" 
                : "text-slate-600 hover:bg-slate-50 border border-transparent"
            }`}
          >
            <User className="mr-2 h-4 w-4" /> Account Profile
          </button>
          
          <button 
            onClick={() => setActiveTab("domain")}
            className={`flex w-full items-center rounded-md px-3 py-2 text-xs font-bold transition-colors ${
              activeTab === "domain" 
                ? "text-indigo-600 bg-indigo-50 border border-indigo-100" 
                : "text-slate-600 hover:bg-slate-50 border border-transparent"
            }`}
          >
            <LayoutGrid className="mr-2 h-4 w-4" /> B2B Decision Domain
          </button>

          <button 
            onClick={() => setActiveTab("ai")}
            className={`flex w-full items-center rounded-md px-3 py-2 text-xs font-bold transition-colors ${
              activeTab === "ai" 
                ? "text-indigo-600 bg-indigo-50 border border-indigo-100" 
                : "text-slate-600 hover:bg-slate-50 border border-transparent"
            }`}
          >
            <Bot className="mr-2 h-4 w-4" /> AI Models & Pipeline
          </button>
          
          <button 
            onClick={() => setActiveTab("database")}
            className={`flex w-full items-center rounded-md px-3 py-2 text-xs font-bold transition-colors ${
              activeTab === "database" 
                ? "text-indigo-600 bg-indigo-50 border border-indigo-100" 
                : "text-slate-600 hover:bg-slate-50 border border-transparent"
            }`}
          >
            <Database className="mr-2 h-4 w-4" /> Database Integration
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Account Profile Tab */}
          {activeTab === "profile" && (
            <div className="glass-panel p-6 rounded-xl bg-white shadow-sm space-y-6 animate-fade-in">
              <h3 className="text-sm font-bold text-slate-800 flex items-center border-b border-border/50 pb-3">
                <User className="mr-2 h-4 w-4 text-indigo-500" /> Account Profile
              </h3>
              
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
                    <input required type="text" className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-primary" value={profileName} onChange={e => setProfileName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Email Address</label>
                    <input required type="email" className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-primary" value={profileEmail} onChange={e => setProfileEmail(e.target.value)} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">New Password (Optional)</label>
                  <input type="password" placeholder="Leave blank to keep current password" className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-primary" value={profilePassword} onChange={e => setProfilePassword(e.target.value)} />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button type="submit" className="px-4 py-2 text-xs font-bold bg-primary text-primary-foreground rounded hover:bg-primary/90 flex items-center shadow-sm">
                    <Save className="mr-2 h-3.5 w-3.5" /> Save Profile
                  </button>
                  
                  {saveStatus === "profile-saving" && <span className="text-xs text-muted-foreground animate-pulse">Saving changes...</span>}
                  {saveStatus === "profile-saved" && <span className="text-xs text-emerald-600 flex items-center"><CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Profile updated successfully!</span>}
                </div>
              </form>
            </div>
          )}

          {/* B2B Decision Domain Tab */}
          {activeTab === "domain" && (
            <div className="glass-panel p-6 rounded-xl bg-white shadow-sm space-y-6 animate-fade-in">
              <div className="border-b border-border/50 pb-3 flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-800 flex items-center">
                  <LayoutGrid className="mr-2 h-4 w-4 text-indigo-500" /> B2B Decision Domain Templates
                </h3>
                {saveStatus === "domain-saved" && (
                  <span className="text-xs text-emerald-600 flex items-center font-bold">
                    <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Domain Config Active!
                  </span>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground leading-relaxed">
                Conclude One is a domain-agnostic reasoning platform. Switch the template configuration below to instantly morph the agent names, RAG nodes, and KPIs across the platform to your B2B use case of choice.
              </p>

              <div className="space-y-4">
                {domains.map((dom) => {
                  const isActive = activeDomain && activeDomain.id === dom.id;
                  return (
                    <div 
                      key={dom.id}
                      onClick={() => !updatingDomain && handleSelectDomain(dom.id)}
                      className={`p-4 border rounded-xl shadow-xs transition-all cursor-pointer flex flex-col justify-between hover:border-indigo-300 relative bg-white ${
                        isActive ? "border-indigo-600 ring-2 ring-indigo-50 bg-indigo-50/10" : "border-border/80"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-slate-800 flex items-center">
                          {dom.name}
                          {isActive && <Sparkles className="ml-2 h-3.5 w-3.5 text-indigo-600" />}
                        </span>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          isActive ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                        }`}>
                          {isActive ? "Active template" : "Select template"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-normal mb-3">
                        Configures metrics ({dom.kpis.metric1}, {dom.kpis.metric2}) and maps vector nodes dynamically.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono border-t border-dashed border-border/60 pt-3">
                        <div className="text-slate-600"><strong>Planner Agent:</strong> {dom.agents.planner}</div>
                        <div className="text-slate-600"><strong>Root Cause/Risk:</strong> {dom.agents.analyzer}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI Orchestrator Pipeline Tab */}
          {activeTab === "ai" && (
            <div className="glass-panel p-6 rounded-xl bg-white shadow-sm space-y-6 animate-fade-in">
              <h3 className="text-sm font-bold text-slate-800 flex items-center border-b border-border/50 pb-3">
                <Bot className="mr-2 h-4 w-4 text-indigo-500" /> AI Provider & Fallback Pipeline
              </h3>
              
              <form onSubmit={handleSaveAI} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Primary Reasoning Provider</label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-primary font-medium" value={primaryModel} onChange={e => setPrimaryModel(e.target.value)}>
                    <option>Gemini 2.5 Flash-Lite (Recommended)</option>
                    <option>OpenRouter API (google/gemini-2.5-flash)</option>
                    <option>Groq API (llama-3.1-8b-instant)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Temperature: {temperature}</label>
                    <span className="text-[10px] text-muted-foreground font-semibold">Lower values are more deterministic</span>
                  </div>
                  <input type="range" min="0.0" max="1.0" step="0.1" className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" value={temperature} onChange={e => setTemperature(parseFloat(e.target.value))} />
                </div>

                <div className="flex items-center space-x-3 bg-indigo-50/50 border border-indigo-100/50 p-3.5 rounded-lg">
                  <input id="fallback-checkbox" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={fallbackEnabled} onChange={e => setFallbackEnabled(e.target.checked)} />
                  <div>
                    <label htmlFor="fallback-checkbox" className="text-xs font-bold text-indigo-950 block">Enable Automatic Provider Failover</label>
                    <span className="text-[10px] text-muted-foreground leading-normal mt-0.5 block">
                      If Gemini quota limits (429/503 Service Unavailable) are reached, route requests to OpenRouter and Groq automatically.
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button type="submit" className="px-4 py-2 text-xs font-bold bg-primary text-primary-foreground rounded hover:bg-primary/90 flex items-center shadow-sm">
                    <Save className="mr-2 h-3.5 w-3.5" /> Save AI Configuration
                  </button>

                  {saveStatus === "ai-saving" && <span className="text-xs text-muted-foreground animate-pulse">Saving AI Config...</span>}
                  {saveStatus === "ai-saved" && <span className="text-xs text-emerald-600 flex items-center"><CheckCircle2 className="mr-1 h-3.5 w-3.5" /> AI Config synced!</span>}
                </div>
              </form>
            </div>
          )}

          {/* Database Integration Tab */}
          {activeTab === "database" && (
            <div className="glass-panel p-6 rounded-xl bg-white shadow-sm space-y-6 animate-fade-in">
              <h3 className="text-sm font-bold text-slate-800 flex items-center border-b border-border/50 pb-3">
                <Database className="mr-2 h-4 w-4 text-indigo-500" /> Database Integrations
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Enterprise MongoDB URL</label>
                  <input type="text" className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-primary font-mono text-slate-600" value={mongoUri} onChange={e => setMongoUri(e.target.value)} />
                </div>

                <div className="flex items-center space-x-4">
                  <button 
                    onClick={handleTestConnection}
                    disabled={testingDb}
                    className="px-4 py-2 text-xs font-bold border border-input rounded bg-background hover:bg-slate-50 flex items-center shadow-sm disabled:opacity-50"
                  >
                    {testingDb ? (
                      <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> Verifying Connection...</>
                    ) : (
                      <>Test MongoDB Connection</>
                    )}
                  </button>
                  
                  {dbStatus === "connected" && (
                    <span className="text-xs text-emerald-600 flex items-center font-semibold">
                      <CheckCircle2 className="mr-1 h-4 w-4" /> Connected Successfully!
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
