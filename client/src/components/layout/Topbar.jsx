import { Bell, Search, UserCircle, Settings, LogOut, CheckCircle2, AlertCircle, X, ShieldAlert } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { apiFetch } from "../../lib/api";

export function Topbar() {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch pending approvals for real-time notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await apiFetch("http://localhost:3005/api/approvals");
        if (res.ok) {
          const data = await res.json();
          const caseNotifs = data.map(c => ({
            id: c._id,
            title: "Approval Required",
            message: `Case ${c.customerId} is ready for decision review.`,
            type: "alert",
            time: new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          
          // Prepend standard system notifications
          setNotifications([
            ...caseNotifs,
            { id: "sys-1", title: "CRM Synced", message: "Customer profiles synchronized successfully.", type: "info", time: "10 mins ago" },
            { id: "sys-2", title: "Model Status", message: "Gemini 2.5 Flash-Lite active as primary provider.", type: "success", time: "1 hour ago" }
          ]);
        }
      } catch (e) {
        console.error("Failed to fetch approvals for notifications");
      }
    };
    
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case "alert": return <ShieldAlert className="h-4 w-4 text-amber-500" />;
      case "success": return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      default: return <CheckCircle2 className="h-4 w-4 text-indigo-500" />;
    }
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-6 relative z-40">
      <div className="flex flex-1 items-center">
        <form className="flex w-full md:ml-0" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <div className="relative w-full max-w-md text-muted-foreground focus-within:text-foreground">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
              <Search className="h-4 w-4" aria-hidden="true" />
            </div>
            <input
              id="search-field"
              className="block h-full w-full border-transparent bg-transparent py-2 pl-8 pr-3 text-sm placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-0"
              placeholder="Search cases, customers, or knowledge..."
              type="search"
              name="search"
            />
          </div>
        </form>
      </div>

      <div className="ml-4 flex items-center md:ml-6 space-x-4">
        {/* Notifications Button & Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-full bg-background p-1.5 text-muted-foreground hover:text-foreground focus:outline-none border border-border/40"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-600 ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-lg border border-border bg-card p-2 shadow-lg animate-fade-in z-50">
              <div className="flex items-center justify-between px-3 py-2 border-b border-border/50">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Notifications</span>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{notifications.length} active</span>
              </div>
              <div className="mt-1 max-h-64 overflow-y-auto space-y-1">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div key={notif.id} className="flex items-start justify-between p-2 rounded-md hover:bg-slate-50 transition-colors">
                      <div className="flex space-x-2.5">
                        <div className="mt-0.5">{getNotifIcon(notif.type)}</div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-800 leading-tight">{notif.title}</span>
                          <span className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{notif.message}</span>
                          <span className="text-[9px] text-slate-400 mt-1">{notif.time}</span>
                        </div>
                      </div>
                      <button onClick={() => clearNotification(notif.id)} className="text-slate-300 hover:text-slate-500">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-muted-foreground">All caught up! No notifications.</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Button & User Menu Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex max-w-xs items-center rounded-full bg-background text-sm focus:outline-none border border-border/40 p-0.5 hover:border-border"
            id="user-menu-button"
          >
            <span className="sr-only">Open user menu</span>
            <div className="h-8 w-8 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-xs shadow-sm">
              {user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "CO"}
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-card p-2 shadow-lg animate-fade-in z-50">
              <div className="px-3 py-2.5 border-b border-border/50 flex flex-col">
                <span className="text-xs font-bold text-slate-800 leading-tight">{user?.name || "Admin User"}</span>
                <span className="text-[11px] text-muted-foreground mt-0.5 leading-none truncate">{user?.email || "admin@conclude.one"}</span>
              </div>
              <div className="mt-1.5 space-y-0.5">
                <Link
                  to="/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center w-full px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                >
                  <Settings className="mr-2 h-4 w-4 text-slate-400" />
                  Settings & Configurations
                </Link>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="flex items-center w-full px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LogOut className="mr-2 h-4 w-4 text-red-400" />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
