import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import React from "react";

const MyMenu: React.FC = () => (
  <NavigationMenu.Root className="bg-gray-900 text-white w-full fixed top-0 left-0 z-50 shadow">
    <NavigationMenu.List className="flex gap-4 p-2 items-center justify-center max-w-6xl mx-auto">
      <NavigationMenu.Item>
        <NavigationMenu.Link
          href="/"
          className="px-3 py-2 rounded hover:bg-gray-800 transition-colors duration-150 text-sm font-medium"
        >
          [H] HOME
        </NavigationMenu.Link>
      </NavigationMenu.Item>

      <NavigationMenu.Item>
        <NavigationMenu.Link
          href="/github"
          className="px-3 py-2 rounded hover:bg-gray-800 transition-colors duration-150 text-sm font-medium"
        >
          [G] GITHUB
        </NavigationMenu.Link>
      </NavigationMenu.Item>

      <NavigationMenu.Item>
        <NavigationMenu.Link
          href="/projects"
          className="px-3 py-2 rounded hover:bg-gray-800 transition-colors duration-150 text-sm font-medium"
        >
          [P] PROJECTS
        </NavigationMenu.Link>
      </NavigationMenu.Item>

      <NavigationMenu.Item>
        <NavigationMenu.Link
          href="/feeling-lucky"
          className="px-3 py-2 rounded hover:bg-gray-800 transition-colors duration-150 text-sm font-medium"
        >
          [F] FEELING LUCKY?
        </NavigationMenu.Link>
      </NavigationMenu.Item>
    </NavigationMenu.List>
  </NavigationMenu.Root>
);

export default MyMenu;
