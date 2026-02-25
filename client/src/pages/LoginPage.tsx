import { useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Shield, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const [, navigate] = useLocation();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    try {
      const success = await login(username.trim(), password);
      if (success) {
        navigate("/");
      } else {
        setError("Invalid username or password.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left panel — brand hero */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] relative overflow-hidden flex-col justify-between bg-gradient-to-b from-[#002060] via-[#0F238C] to-[#002060] text-white p-10">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Top — logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/10">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">ASML</span>
          </div>
        </div>

        {/* Center — headline */}
        <div className="relative z-10 -mt-10">
          <h1 className="text-3xl xl:text-4xl font-bold leading-tight tracking-tight mb-4">
            EHS Safety
            <br />
            Platform
          </h1>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            Pre-task planning, permit management, incident tracking, and compliance — all in one place.
          </p>
        </div>

        {/* Bottom — decorative stats */}
        <div className="relative z-10 flex gap-8">
          {[
            { value: "99.7%", label: "Compliance" },
            { value: "2,400+", label: "Plans Filed" },
            { value: "0", label: "Lost Time" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-xl font-bold font-mono">{s.value}</div>
              <div className="text-[11px] text-white/40 uppercase tracking-wider mt-0.5">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Accent glow */}
        <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-[#E8590C]/20 blur-[120px] pointer-events-none" />
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center bg-[#fafbfc] px-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-lg bg-[#0F238C] flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-semibold text-[#0F238C]">ASML EHS</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Sign in</h2>
          <p className="text-sm text-gray-500 mt-1 mb-8">
            Use your organizational account to continue.
          </p>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-5">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-xs font-medium text-gray-600 mb-1.5">
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="carl.murphy"
                className="w-full h-11 rounded-lg border border-gray-300 bg-white px-3.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#0F238C] focus:ring-2 focus:ring-[#0F238C]/20"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-600 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-11 rounded-lg border border-gray-300 bg-white px-3.5 pr-10 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#0F238C] focus:ring-2 focus:ring-[#0F238C]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember + forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 rounded border-gray-300 text-[#0F238C] focus:ring-[#0F238C]/30"
                />
                <span className="text-xs">Keep me signed in</span>
              </label>
              <button type="button" className="text-xs text-[#0F238C] hover:underline font-medium">
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-[#0F238C] text-white text-sm font-medium flex items-center justify-center gap-2 transition hover:bg-[#1E3AAF] active:bg-[#0A1A6B] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[11px] text-gray-400 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* SSO button */}
          <button
            type="button"
            className="w-full h-11 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 flex items-center justify-center gap-2.5 transition hover:bg-gray-50 hover:border-gray-400"
          >
            <svg className="w-4 h-4" viewBox="0 0 21 21" fill="none">
              <rect x="1" y="1" width="9" height="9" fill="#F25022" />
              <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
              <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
              <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
            </svg>
            Sign in with Microsoft
          </button>

          {/* Footer */}
          <p className="text-center text-[11px] text-gray-400 mt-8">
            Protected by organizational security policies.
          </p>
        </div>
      </div>
    </div>
  );
}
