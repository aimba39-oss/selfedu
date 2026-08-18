import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import SpaceBackground from "./SpaceBackground";

type Theme = "light" | "dark";

function SiteLayout() {
  const [theme, setTheme] = useState<Theme>(() => {
    return localStorage.getItem("selfedu-theme") === "dark"
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("selfedu-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) =>
      current === "light" ? "dark" : "light",
    );
  };

  return (
    <div className="site">
      <SpaceBackground />

      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="route-content">
        <Outlet />
      </main>

      <footer className="site-footer">
        <span>© 2026 SelfEDU IELTS</span>
        <span>Learn. Practice. Improve.</span>
      </footer>
    </div>
  );
}

export default SiteLayout;