import React, { useEffect, useState } from "react";
const Clock = ()=>{
    const [time,setTime] = useState(new Date());

    useEffect(()=>{
        const timer = setInterval (()=>{
            setTime(new Date());
        },1000);
        return()=> clearInterval(timer);
    },[]);

    const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };
    return (
  <div className="flex flex-col items-center gap-3">
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-30" />

      {/* Main clock */}
      <div className="relative bg-white/70 backdrop-blur-md rounded-xl px-6 py-4 shadow-xl border border-white/30">
        <div className="text-3xl font-mono font-bold text-indigo-600 tracking-wider tabular-nums">
          {formatTime(time)}
        </div>

        <div className="text-sm text-gray-500 text-center mt-1">
          {formatDate(time)}
        </div>
      </div>
    </div>
  </div>
);
};

export default Clock;