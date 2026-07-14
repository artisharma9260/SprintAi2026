import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/app");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-6">
      <div className="w-full max-w-md glass-strong rounded-3xl p-8">
        <Link to="/" className="flex items-center gap-2 mb-8" data-testid="auth-logo">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white">
            <Zap className="w-4 h-4" />
          </div>
          <span className="font-display font-bold text-lg">SkillSprint <span className="text-orange-500">AI</span></span>
        </Link>
        <h1 className="font-display text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-neutral-500 mt-1">Log in to your Career Copilot.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <Label>Email</Label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} data-testid="login-email" className="mt-1 rounded-xl h-11" />
          </div>
          <div>
            <div className="flex justify-between items-center">
              <Label>Password</Label>
              <Link to="/forgot" className="text-xs text-orange-600 hover:underline" data-testid="forgot-link">Forgot?</Link>
            </div>
            <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} data-testid="login-password" className="mt-1 rounded-xl h-11" />
          </div>
          <Button type="submit" disabled={loading} className="w-full rounded-full btn-coral border-0 h-11" data-testid="login-submit">
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </form>

        <p className="mt-6 text-sm text-center text-neutral-600">
          No account? <Link to="/signup" className="text-orange-600 font-medium hover:underline" data-testid="signup-link">Create one</Link>
        </p>
      </div>
    </div>
  );
}
