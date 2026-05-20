import { Button } from "../../ui/button";
import NavbarMobile from "./NavbarMobile";
import NavbarLinks from "./NavbarLinks";
import NavbarThemeToggle from "./NavbarThemeToggle";
import { useMobileMenu } from "./hooks/useMobileMenu";
import { useNavbarVisibility } from "./hooks/useNavbarVisibility";
import { useTheme } from "./hooks/useTheme";

const Navbar = () => {
  const { isOpen, setIsOpen, toggleMenu } = useMobileMenu();
  const { isDark, toggleTheme } = useTheme();
  const isVisible = useNavbarVisibility();
  const shouldShowNavbar = isOpen || isVisible;

  return (
    <div>
      <div
        className={`fixed top-0 z-40 h-16 w-full border-b border-border bg-background text-foreground transition-transform duration-300 ${
          shouldShowNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className=" max-w-7xl p-4 md:p-0 mx-auto h-full">
          <div className="flex items-center h-full">
            <h1 className="text-xl font-bold">My App</h1>
            <div className="ml-auto flex items-center gap-4">
              <NavbarLinks />
              <NavbarThemeToggle
                isDark={isDark}
                onToggleTheme={toggleTheme}
              />
              <Button className="md:hidden" onClick={toggleMenu}>
                Menu
              </Button>
              <Button className="hidden md:block" variant="outline">
                Login
              </Button>
            </div>
          </div>
          <NavbarMobile isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
