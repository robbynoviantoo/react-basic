import { NavLink } from "react-router";
import menu from "@/lib/navlink";

type NavbarMobileProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const NavbarMobile = ({ isOpen, setIsOpen }: NavbarMobileProps) => {
  return (
    <div
      className={`
        fixed inset-0 z-50 bg-zinc-700 text-white
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}
    >
      <div className="absolute top-4 right-4">
        <div
          className="h-14 w-14 bg-white flex items-center justify-center text-black rounded-lg cursor-pointer"
          onClick={() => setIsOpen(false)}
        >
          X
        </div>
      </div>

      <div className="h-full flex flex-col items-center justify-center gap-10 text-4xl">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              isActive ? "text-white" : "text-zinc-300"
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default NavbarMobile;