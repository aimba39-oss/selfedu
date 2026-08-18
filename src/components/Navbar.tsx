import { Link } from "react-router-dom";

import ThemeToggle from "./ThemeToggle";

type Theme = "light" | "dark";

interface NavbarProps {
  theme: Theme;
  onToggleTheme: () => void;
}

function Navbar({ theme, onToggleTheme }: NavbarProps) {
  return (
    <header className="navbar">
      <Link className="brand" to="/">
        <div className="brand-mark">S</div>

        <div className="brand-text">
          <span className="brand-name">SelfEDU</span>
          <span className="brand-subtitle">IELTS</span>
        </div>
      </Link>

      <nav className="nav-links">
        <Link to="/practice">Practice</Link>
        <Link to="/ai-coach">AI Coach</Link>
        <Link to="/progress">Progress</Link>
        <Link to="/profile">Profile</Link>
      </nav>

      <div className="nav-actions">
        <ThemeToggle
          theme={theme}
          onToggle={onToggleTheme}
        />

        <Link className="profile-button" to="/profile">
          Sign in
        </Link>
      </div>
    </header>
  );
}

export default Navbar;