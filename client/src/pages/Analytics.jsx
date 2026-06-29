import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, Target, ShieldCheck, Zap } from "lucide-react";
import { apiFetch } from "../lib/api";

const trendData = [
  { name: 'Week 1', cases: 120, approvals: 100 },
  { name: 'Week 2', cases: 180, approvals: 150 },
  { name: 'Week 3', cases: 250, approvals: 210 },
  { name: 'Week 4', cases: 380, approvals: 340 },
  { name: 'Week 5', cases: 410, approvals: 380 },
];

const agentData = [
  { name: 'Meeting', time: 512 },
  { name: 'CRM', time: 418 },
  { name: 'Risk', time: 592 },
  { name: 'Recommend', time: 583 },
  { name: 'Explain', time: 767 },
  { name: 'Memory', time: 212 },
];

export default function Analytics() {
  const [stats, setStats] = useState({
    recommendationsGenerated: 0,
    approvalRate: "0%",
    averageConfidence: "0%",
    averageProcessingTime: "0s"
  });

  useEffect(() => {
    apiFetch("http://localhost:3005/api/analytics")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-10 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border/50 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Executive Analytics</h1>
          <p className="text-muted-foreground mt-1 text-[15px]">
            Monitor agentic performance, automation rates, and enterprise risk.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-xl transition-shadow hover:shadow-md">
          <h3 className="tracking-widest text-[11px] font-bold uppercase text-muted-foreground mb-4">Cases Analyzed</h3>
          <div className="flex items-end justify-between">
            <div className="text-4xl font-semibold tracking-tight">{stats.recommendationsGenerated}</div>
            <Activity className="h-5 w-5 text-muted-foreground mb-1" />
          </div>
          <p className="text-xs text-muted-foreground mt-3"><span className="text-blue-600 font-semibold mr-1">+14%</span> from last month</p>
        </div>

        <div className="glass-panel p-6 rounded-xl transition-shadow hover:shadow-md">
          <h3 className="tracking-widest text-[11px] font-bold uppercase text-muted-foreground mb-4">Automation Rate</h3>
          <div className="flex items-end justify-between">
            <div className="text-4xl font-semibold tracking-tight text-emerald-600">{stats.approvalRate}</div>
            <ShieldCheck className="h-5 w-5 text-emerald-600 mb-1" />
          </div>
          <p className="text-xs text-muted-foreground mt-3"><span className="text-emerald-600 font-semibold mr-1">+2%</span> from last month</p>
        </div>

        <div className="glass-panel p-6 rounded-xl transition-shadow hover:shadow-md">
          <h3 className="tracking-widest text-[11px] font-bold uppercase text-muted-foreground mb-4">Avg. Confidence</h3>
          <div className="flex items-end justify-between">
            <div className="text-4xl font-semibold tracking-tight">{stats.averageConfidence}</div>
            <Target className="h-5 w-5 text-muted-foreground mb-1" />
          </div>
          <p className="text-xs text-muted-foreground mt-3">Consistently above target</p>
        </div>

        <div className="glass-panel p-6 rounded-xl transition-shadow hover:shadow-md">
          <h3 className="tracking-widest text-[11px] font-bold uppercase text-muted-foreground mb-4">Avg. Latency</h3>
          <div className="flex items-end justify-between">
            <div className="text-4xl font-semibold tracking-tight">{stats.averageProcessingTime}</div>
            <Zap className="h-5 w-5 text-muted-foreground mb-1" />
          </div>
          <p className="text-xs text-muted-foreground mt-3">Across 8 parallel agents</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area Chart */}
        <div className="glass-panel p-8 rounded-xl">
          <h3 className="tracking-widest text-[11px] font-bold uppercase text-muted-foreground mb-6">Orchestration Volume (30 Days)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e293b" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1e293b" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorApprovals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7', borderRadius: '8px', color: '#09090b', padding: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#09090b', fontSize: '13px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="cases" stroke="#1e293b" strokeWidth={2} fillOpacity={1} fill="url(#colorCases)" name="Cases Analyzed" />
                <Area type="monotone" dataKey="approvals" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorApprovals)" name="Approved Actions" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="glass-panel p-8 rounded-xl">
          <h3 className="tracking-widest text-[11px] font-bold uppercase text-muted-foreground mb-6">Agent Execution Latency (ms)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#f4f4f5'}}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7', borderRadius: '8px', color: '#09090b', padding: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#09090b', fontSize: '13px', fontWeight: 'bold' }}
                />
                <Bar dataKey="time" fill="#1e293b" radius={[4, 4, 0, 0]} name="Execution Time (ms)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
