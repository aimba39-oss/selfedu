type Theme = "light" | "dark";

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

function ThemeToggle({
  theme,
  onToggle,
}: ThemeToggleProps) {
  return (
    <button
      className="theme-button"
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${
        theme === "light" ? "dark" : "light"
      } mode`}
      title={`Switch to ${
        theme === "light" ? "dark" : "light"
      } mode`}
    >
      <span className="theme-icon">
        {theme === "light" ? "☼" : "☾"}
      </span>
    </button>
  );
}

export default ThemeToggle;