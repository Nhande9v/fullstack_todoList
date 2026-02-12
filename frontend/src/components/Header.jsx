import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Clock from "./Clock";
import api from "@/lib/axios";
export const Header = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

    const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
    };
    return <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold text-transparent bg-primary bg-clip-text">To do list</h1>
        <div className=" flex flex-col items-center gap-3">
             <p className="text-muted-foreground">No pain, no gain 💪✨ </p>
             <Clock/>
        </div>
        {/*  GUEST MODE BANNER */}
        {!token && (
          <div className="absolute top-2 right-4 flex items-center gap-3">
            <p className="text-sm text-orange-600 font-medium">
            Guest mode
            </p>
          <button
            onClick={() => navigate("/register")}
            className="text-sm px-3 py-1 rounded-lg bg-primary text-white hover:opacity-90 transition"
          >
          Sign up
          </button>
          </div>
        )}

      {/*  USER MENU */}
      {token && (
        <div className="absolute top-2 right-4">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow hover:shadow-md transition"
          >
            <span className="text-sm">👋 {user?.name || "User"}</span>
            <span className="text-xs">⌄</span>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-36 bg-white border rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-500"
              >
                🚪 Sign out
              </button>
            </div>
          )}
        </div>
      )}
    </div>
};


export default Header;