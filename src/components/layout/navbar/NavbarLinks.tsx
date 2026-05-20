import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { NavLink } from "react-router";

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <NavLink to={href}>
          <div className="flex flex-col gap-1 text-sm">
            <div className="leading-none font-medium">{title}</div>
            <div className="line-clamp-2 text-muted-foreground">{children}</div>
          </div>
        </NavLink>
      </NavigationMenuLink>
    </li>
  );
}

const NavbarLinks = () => {
  return (
    <NavigationMenu className="hidden md:block">
      <NavigationMenuList className="gap-4">
        <NavigationMenuItem>
          <NavigationMenuLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? "text-foreground" : "text-muted-foreground"
              }
              to="/"
            >
              Home
            </NavLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? "text-foreground" : "text-muted-foreground"
              }
              to="/about"
            >
              About
            </NavLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? "text-foreground" : "text-muted-foreground"
              }
              to="/mcs"
            >
              MCS
            </NavLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>List</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-96">
              <ListItem href="/docs" title="Introduction">
                Re-usable components built with Tailwind CSS.
              </ListItem>
              <ListItem href="/docs/installation" title="Installation">
                How to install dependencies and structure your app.
              </ListItem>
              <ListItem href="/docs/primitives/typography" title="Typography">
                Styles for headings, paragraphs, lists...etc
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavbarLinks;
