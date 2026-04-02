import React from "react";
import { Pointer } from "lucide-react";

interface Props {
  visible: boolean;
}

const SwipeHint: React.FC<Props> = ({ visible }) => (
  <div
    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none"
    style={{
      opacity: visible ? 1 : 0,
      transition: "opacity 0.5s ease",
    }}
  >
    <Pointer
      size={36}
      color="white"
      style={{
        animation: visible ? "swipe-up 1.2s ease-in-out infinite" : "none",
      }}
    />
    <p className="text-white/80 text-xs font-medium tracking-wide">Swipe up</p>
    <style>{`
      @keyframes swipe-up {
        0%   { transform: translateY(0); opacity: 1; }
        60%  { transform: translateY(-18px); opacity: 0.6; }
        100% { transform: translateY(0); opacity: 1; }
      }
    `}</style>
  </div>
);

export default SwipeHint;
