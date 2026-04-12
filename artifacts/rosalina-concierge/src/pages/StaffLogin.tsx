import { useState } from "react";
import { useLocation } from "wouter";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { checkStaffPin, createSession } from "@/lib/staff-auth";
import { motion } from "framer-motion";

export default function StaffLogin() {
  const [, setLocation] = useLocation();
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [blocked, setBlocked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (blocked) return;
    setLoading(true);
    setError("");

    setTimeout(() => {
      if (checkStaffPin(pin)) {
        createSession();
        setLocation("/staff/report");
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= 5) {
          setBlocked(true);
          setError("Too many failed attempts. Access blocked for this session.");
        } else {
          setError(`Incorrect PIN. ${5 - newAttempts} attempt${5 - newAttempts !== 1 ? "s" : ""} remaining.`);
        }
        setPin("");
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: "#0B1730" }}>
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <p className="font-serif text-4xl text-white mb-1 tracking-wide">Rosalina</p>
          <p className="text-white/30 text-xs font-medium tracking-[3px] uppercase">Staff Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/15 border border-primary/20 mx-auto mb-6">
            <ShieldCheck className="w-7 h-7 text-primary" />
          </div>

          <h1 className="text-white text-xl font-semibold text-center mb-1">Staff Access</h1>
          <p className="text-white/40 text-sm text-center mb-8">Enter your staff PIN to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="staff-pin" className="text-white/60 text-xs font-medium mb-2 block tracking-wide uppercase">
                Staff PIN
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  id="staff-pin"
                  type={showPin ? "text" : "password"}
                  placeholder="Enter PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="bg-white/8 border-white/15 text-white placeholder:text-white/20 focus-visible:ring-primary h-13 pl-11 pr-11 text-base tracking-widest"
                  style={{ height: "52px" }}
                  autoComplete="current-password"
                  disabled={blocked || loading}
                  data-testid="input-staff-pin"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  tabIndex={-1}
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs text-center bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5"
                data-testid="text-login-error"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              className="w-full h-13 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90"
              style={{ height: "52px" }}
              disabled={!pin || loading || blocked}
              data-testid="button-staff-login"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Access Staff Portal"
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-8">
          Session expires automatically after 8 hours
        </p>

        <div className="text-center mt-4">
          <a href="/" className="text-white/30 text-xs hover:text-white/50 transition-colors">
            ← Back to guest hub
          </a>
        </div>
      </motion.div>
    </div>
  );
}
