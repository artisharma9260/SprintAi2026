import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("If the email exists, reset instructions were sent.");
    } catch {
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-6">
      <div className="w-full max-w-md glass-strong rounded-3xl p-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">Reset password</h1>
        <p className="text-sm text-neutral-500 mt-1">Enter your email and we'll send instructions.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <Label>Email</Label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} data-testid="forgot-email" className="mt-1 rounded-xl h-11" />
          </div>
          <Button type="submit" className="w-full rounded-full btn-coral border-0 h-11" data-testid="forgot-submit">Send reset link</Button>
        </form>
        <p className="mt-6 text-sm text-center text-neutral-600">
          <Link to="/login" className="text-orange-600 font-medium hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
