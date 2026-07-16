import { useState, useEffect } from "react";
import { Database, RefreshCw, CheckCircle2 } from "lucide-react";
import { apiFetch } from "../lib/api";

export default function KnowledgeCenter() {
  const [sources, setSources] = useState([]);

  useEffect(() => {
    apiFetch("http://localhost:3005/api/knowledge")
      .then(res => res.json())
      .then(data => setSources(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Knowledge Center</h1>
        <p className="text-muted-foreground mt-2">
          Manage connected enterprise knowledge sources and ChromaDB embeddings.
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-muted/50 border-b border-border text-muted-foreground">
            <tr>
              <th className="px-6 py-4 font-medium">Data Source</th>
              <th className="px-6 py-4 font-medium">Integration Status</th>
              <th className="px-6 py-4 font-medium">Embedded Items</th>
              <th className="px-6 py-4 font-medium">Last Vector Sync</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((s, i) => (
              <tr key={i} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-medium flex items-center space-x-3">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <span>{s.source}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center text-emerald-500 font-medium">
                    <CheckCircle2 className="h-4 w-4 mr-1.5" />
                    {s.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{s.items}</td>
                <td className="px-6 py-4 text-muted-foreground flex items-center">
                  <RefreshCw className="h-3 w-3 mr-1.5" />
                  {s.lastSync}
                </td>
              </tr>
            ))}
            {sources.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-muted-foreground">
                  Loading connected sources...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
