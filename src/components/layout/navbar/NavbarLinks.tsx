import menu from "@/lib/navlink";
import { NavLink } from "react-router";

const NavbarLinks = () => {
  return (
    <div>
      <ul className="hidden gap-8 text-muted-foreground md:flex">
        {menu.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.href}
              className={({ isActive }) =>
                isActive ? "text-foreground" : "hover:text-foreground"
              }
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavbarLinks;
