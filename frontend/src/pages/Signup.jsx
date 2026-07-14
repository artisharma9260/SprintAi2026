import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap } from "lucide-react";
import { toast } from "sonner";

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success("Welcome to SkillSprint AI!");
      navigate("/app/passport");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-6">
      <div className="w-full max-w-md glass-strong rounded-3xl p-8">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white">
            <Zap className="w-4 h-4" />
          </div>
          <span className="font-display font-bold text-lg">SkillSprint <span className="text-orange-500">AI</span></span>
        </Link>
        <h1 className="font-display text-3xl font-bold tracking-tight">Create your Passport</h1>
        <p className="text-sm text-neutral-500 mt-1">Start applying smarter in 2 minutes.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <Label>Full name</Label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} data-testid="signup-name" className="mt-1 rounded-xl h-11" />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} data-testid="signup-email" className="mt-1 rounded-xl h-11" />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} data-testid="signup-password" className="mt-1 rounded-xl h-11" />
          </div>
          <Button type="submit" disabled={loading} className="w-full rounded-full btn-coral border-0 h-11" data-testid="signup-submit">
            {loading ? "Creating..." : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-sm text-center text-neutral-600">
          Have an account? <Link to="/login" className="text-orange-600 font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
