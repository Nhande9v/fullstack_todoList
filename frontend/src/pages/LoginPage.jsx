import { useState } from "react";
import api from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    toast.error("Please enter both email and password");
    return;
  }

  try {
    const res = await api.post("/auth/login", { email, password });

    const token = res.data.token || res.data.accessToken;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    toast.success("Signed in successfully!");
    navigate("/");
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Invalid email or password"
    );
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

    <form
      onSubmit={handleSubmit}
      className="relative z-10 bg-white p-6 rounded-xl shadow-xl w-80 space-y-4"
    >
      <h2 className="text-xl font-bold text-center">Login</h2>

      <input
        className="border w-full p-2 rounded"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border w-full p-2 rounded"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="bg-primary text-white w-full py-2 rounded hover:opacity-90 transition">
        Sign In
      </button>

      <p className="text-center text-sm">
        Don’t have an account?{" "}
        <span
          onClick={() => navigate("/register")}
          className="text-blue-500 cursor-pointer"
        >
          Sign up
        </span>
      </p>
    </form>
  </div>
);
}