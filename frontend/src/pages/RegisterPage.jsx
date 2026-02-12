import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import api from "@/lib/axios";
import { toast } from "sonner";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [name, setName] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await api.post("/auth/register", {
        name,
        email: form.email,
        password: form.password,
      });

      toast.success("Account created successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
  <div className="min-h-screen w-full bg-[#f8fafc] relative flex items-center justify-center">
    <div
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: `
          linear-gradient(135deg, 
            rgba(248,250,252,1) 0%, 
            rgba(219,234,254,0.7) 30%, 
            rgba(165,180,252,0.5) 60%, 
            rgba(129,140,248,0.6) 100%
          ),
          radial-gradient(circle at 20% 30%, rgba(255,255,255,0.6) 0%, transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(199,210,254,0.4) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(224,231,255,0.3) 0%, transparent 60%)
        `,
      }}
    />

    <Card className="relative z-10 w-[360px] shadow-xl rounded-xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Create Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <Button type="submit" className="w-full">
            Sign Up
          </Button>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-500 cursor-pointer"
            >
              Sign In
            </span>
          </p>
        </form>
      </CardContent>
    </Card>
  </div>
);
};  

export default RegisterPage;