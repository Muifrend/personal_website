import React, { useState, useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";

export default function NavigationMenu() {
  // 1. Hotkey Logic
  useHotkeys("h", () => (window.location.href = "/"), { preventDefault: true });
  useHotkeys("p", () => (window.location.href = "/projects"), {
    preventDefault: true,
  });
  useHotkeys("f", () => (window.location.href = "/feeling-lucky"), {
    preventDefault: true,
  });

  // 2. Active State Logic
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    // Sets the path when the component mounts (client-side only)
    setCurrentPath(window.location.pathname);
  }, []);

  // Helper: Styles for the Link Container
  const getLinkClass = (path: string) => {
    const base =
      "flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-200 text-m font-medium group";

    // Active: Light grey background, dark text
    const active = "bg-gray-100 text-black";

    // Inactive: Grey text, subtle hover effect
    const inactive = "text-gray-500 hover:text-black hover:bg-gray-50";

    return currentPath === path ? `${base} ${active}` : `${base} ${inactive}`;
  };

  // Helper: Styles for the "Keycap" (The [H] box)
  const getKeyClass = (path: string) => {
    const base =
      "font-mono text-[12px] min-w-[20px] h-5 flex items-center justify-center rounded border shadow-[0_1px_0_rgba(0,0,0,0.05)] transition-colors";

    // Active Key: White key on grey background, darker border
    const active = "bg-white border-gray-300 text-black";

    // Inactive Key: Light grey key, subtle border
    const inactive =
      "bg-gray-50 border-gray-200 text-gray-400 group-hover:border-gray-300 group-hover:text-gray-600";

    return currentPath === path ? `${base} ${active}` : `${base} ${inactive}`;
  };

  return (
    // Container: White background with subtle blur and border
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between sm:justify-start">
        {/* Mobile: Simple Name Logo */}
        <div className="sm:hidden font-mono text-black text-sm font-bold tracking-tighter">
          ANDREW_FIREK
        </div>

        {/* Desktop: Navigation Links */}
        <ul className="hidden sm:flex items-center gap-1 mx-auto list-none m-0 p-0">
          <li>
            <a href="/" className={getLinkClass("/")}>
              <span className={getKeyClass("/")}>H</span>
              <span>Home</span>
            </a>
          </li>

          <li>
            <a href="/projects" className={getLinkClass("/projects")}>
              <span className={getKeyClass("/projects")}>P</span>
              <span>Projects</span>
            </a>
          </li>

          <li>
            <a href="/feeling-lucky" className={getLinkClass("/feeling-lucky")}>
              <span className={getKeyClass("/feeling-lucky")}>F</span>
              <span>I'm Feeling Lucky</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
