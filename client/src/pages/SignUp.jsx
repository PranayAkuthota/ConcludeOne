import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BrainCircuit, Loader2, AlertCircle, ArrowLeft } from "lucide-react";

export default function SignUp() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setSubmitting(true);
    const res = await signup(name, email, password);
    setSubmitting(false);

    if (res.success) {
      navigate("/dashboard");
    } else {
      setError(res.error || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-foreground font-sans flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <Link to="/" className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Home
        </Link>
        <Link to="/" className="flex items-center space-x-2 mb-6">
          <BrainCircuit className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold tracking-tight uppercase">Conclude One</span>
        </Link>
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
          Create a new account
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Or{" "}
          <Link to="/signin" className="font-semibold text-primary hover:underline">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-panel bg-white py-8 px-4 sm:rounded-xl sm:px-10 border border-border/80 shadow-elevated">
          {error && (
            <div className="mb-6 rounded-md bg-destructive/5 border border-destructive/20 p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-destructive mr-2.5 mt-0.5" />
                <span className="text-sm font-medium text-destructive">{error}</span>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Full Name
              </label>
              <div className="mt-1.5">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-md border border-border bg-white px-3 py-2 text-sm placeholder-muted-foreground/60 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Alex Johnson"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Email Address
              </label>
              <div className="mt-1.5">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border border-border bg-white px-3 py-2 text-sm placeholder-muted-foreground/60 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Password (min 6 characters)
              </label>
              <div className="mt-1.5">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border border-border bg-white px-3 py-2 text-sm placeholder-muted-foreground/60 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={submitting}
                className="btn-premium w-full inline-flex items-center justify-center font-bold"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
