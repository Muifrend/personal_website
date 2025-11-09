import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import React from "react";

const MyMenu: React.FC = () => (
  <NavigationMenu.Root className="MyNavRoot">
    <NavigationMenu.List className="MyNavList">
      <NavigationMenu.Item>
        <NavigationMenu.Link href="/" className="MyNavLink">
          [H] HOME
        </NavigationMenu.Link>
      </NavigationMenu.Item>

      <NavigationMenu.Item>
        <NavigationMenu.Link href="/github" className="MyNavLink">
          [G] GITHUB
        </NavigationMenu.Link>
      </NavigationMenu.Item>

      <NavigationMenu.Item>
        <NavigationMenu.Link href="/projects" className="MyNavLink">
          [P] PROJECTS
        </NavigationMenu.Link>
      </NavigationMenu.Item>

      <NavigationMenu.Item>
        <NavigationMenu.Link href="/feeling-lucky" className="MyNavLink">
          [F] FEELING LUCKY?
        </NavigationMenu.Link>
      </NavigationMenu.Item>
    </NavigationMenu.List>
  </NavigationMenu.Root>
);
// Apply Tailwind utility classes to the existing Radix NavigationMenu markup so it appears as a horizontal bar
(function applyTailwindNavBar() {
  function apply() {
    const root = document.querySelector(".MyNavRoot") as HTMLElement | null;
    if (!root) return;

    // Root nav bar: full width, fixed to top, dark background
    root.classList.add(
      "bg-gray-900",
      "text-white",
      "w-full",
      "fixed",
      "top-0",
      "left-0",
      "z-50",
      "shadow"
    );

    // List layout: horizontal flex container, centered, with spacing
    const list = root.querySelector(".MyNavList") as HTMLElement | null;
    if (list) {
      list.classList.add(
        "flex",
        "gap-4",
        "p-2",
        "items-center",
        "justify-center",
        "max-w-6xl",
        "mx-auto"
      );
    }

    // Links: padding, rounded, hover state
    const links = root.querySelectorAll<HTMLElement>(".MyNavLink");
    links.forEach((el) =>
      el.classList.add(
        "px-3",
        "py-2",
        "rounded",
        "hover:bg-gray-800",
        "transition-colors",
        "duration-150",
        "text-sm",
        "font-medium"
      )
    );
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", apply, { once: true });
    } else {
      apply();
    }
  }
})();
export default MyMenu;
