import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

const ADMIN_PWD_KEY = "smileyque_admin_pwd";
const ADMIN_SESSION_KEY = "smileyque_admin_auth";
const DEFAULT_PASSWORD = "admin123";

function getStoredPassword(): string {
  try {
    return localStorage.getItem(ADMIN_PWD_KEY) ?? DEFAULT_PASSWORD;
  } catch {
    return DEFAULT_PASSWORD;
  }
}

export function isAdminAuthenticated(): boolean {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function adminLogout() {
  try {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  } catch {
    // ignore
  }
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password === getStoredPassword()) {
      try {
        sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
      } catch {
        // ignore
      }
      navigate("/admin");
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-background p-10 border border-border shadow-elegant">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary/10 rounded-sm flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-primary" />
          </div>
          <h1 className="font-playfair text-3xl font-semibold">Admin Login</h1>
          <p className="font-inter text-xs text-muted-foreground mt-2">
            Enter your admin password to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block font-inter text-xs tracking-widest uppercase text-muted-foreground mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Enter admin password"
              className="w-full border border-border bg-background text-foreground text-sm px-4 py-3 focus:outline-none focus:border-primary transition-colors"
              autoFocus
            />
          </div>

          {error && (
            <p className="font-inter text-xs text-destructive">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-inter text-sm font-semibold tracking-wide py-3 hover:bg-gold-light transition-colors duration-200"
          >
            Sign In
          </button>
        </form>

        <p className="text-center font-inter text-xs text-muted-foreground mt-6">
          Default password: <code className="text-foreground">admin123</code>
          <br />
          (Change it from the Admin → Settings tab)
        </p>
      </div>
    </div>
  );
}
