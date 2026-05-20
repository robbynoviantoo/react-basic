import { Moon, Sun } from "lucide-react";
import { Button } from "../../ui/button";

type NavbarThemeToggleProps = {
  isDark: boolean;
  onToggleTheme: () => void;
};

const NavbarThemeToggle = ({
  isDark,
  onToggleTheme,
}: NavbarThemeToggleProps) => {
  return (
    <Button variant="outline" size="icon" onClick={onToggleTheme}>
      {isDark ? <Sun /> : <Moon />}
      <span className="sr-only">{isDark ? "Light Mode" : "Dark Mode"}</span>
    </Button>
  );
};

export default NavbarThemeToggle;
