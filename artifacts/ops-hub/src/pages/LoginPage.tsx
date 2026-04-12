import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

const STAFF_PIN = "Rosalina2025!";

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === STAFF_PIN) {
      sessionStorage.setItem("ops_hub_session", Date.now().toString());
      onLogin();
    } else {
      setError("Invalid PIN. Please try again.");
      setPin("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background" data-testid="login-page">
      <h1 className="font-serif text-3xl text-primary mb-1" data-testid="login-brand">Rosalina</h1>
      <p className="text-[11px] tracking-[0.35em] uppercase text-muted-foreground mb-10">Operations Hub</p>

      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock size={20} className="text-primary" />
          </div>
        </div>
        <h2 className="font-serif text-xl text-center mb-1">Staff Access</h2>
        <p className="text-sm text-muted-foreground text-center mb-6">Enter your staff PIN to continue</p>

        <form onSubmit={handleSubmit}>
          <label className="text-xs font-medium tracking-wider uppercase text-muted-foreground mb-2 block">Staff PIN</label>
          <div className="relative mb-4">
            <input
              type={showPin ? "text" : "password"}
              value={pin}
              onChange={(e) => { setPin(e.target.value); setError(""); }}
              placeholder="Enter PIN"
              className="w-full h-11 px-4 pr-10 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              data-testid="input-pin"
              autoFocus
            />
            <button type="button" onClick={() => setShowPin(!showPin)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {error && <p className="text-xs text-red-400 mb-3" data-testid="login-error">{error}</p>}
          <button type="submit"
            className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
            data-testid="btn-login">
            Access Operations Hub
          </button>
        </form>
      </div>
      <p className="text-xs text-muted-foreground mt-6">Session expires when browser closes</p>
    </div>
  );
}
