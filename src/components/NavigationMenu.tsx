import React, { useState, useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";

const NavigationMenu: React.FC = () => {
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

  return (
    // Container: White background with subtle blur and border
    <nav className="site-nav bg-white/80">
      <div className="site-container h-14 flex items-center justify-between sm:justify-start">
        {/* Mobile: Simple Name Logo */}
        <a className="sm:hidden font-mono text-black text-sm font-bold tracking-tighter" href="/">
          ANDREW_FIREK
        </a>
        <a
          href="/projects"
          className="sm:hidden font-mono text-sm  text-gray-500 hover:text-black transition-colors"
        >
          Projects
        </a>

        {/* Desktop: Navigation Links */}
         <ul className="hidden sm:flex items-center gap-1 mx-auto list-none m-0 p-0">
  <li>
    <a 
      href="/" 
      // If path matches, add "active". The CSS handles the rest.
      className={`group nav-link ${currentPath === "/" ? "active" : ""}`}
    >
      <span className="nav-key">H</span>
      <span>Home</span>
    </a>
  </li>

  <li>
    <a 
      href="/projects" 
      className={`group nav-link ${currentPath === "/projects" ? "active" : ""}`}
    >
      <span className="nav-key">P</span>
      <span>Projects</span>
    </a>
  </li>

  <li>
    <a 
      href="/feeling-lucky" 
      className={`group nav-link ${currentPath === "/feeling-lucky" ? "active" : ""}`}
    >
      <span className="nav-key">F</span>
      <span>I'm Feeling Lucky</span>
    </a>
  </li>
</ul>
      </div>
    </nav>
  );
}

export default NavigationMenu;