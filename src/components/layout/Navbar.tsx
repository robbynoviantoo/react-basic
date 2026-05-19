import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { Button } from "../ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menu = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth >= 768) {
            setIsOpen(false);
        }
    };

    window.addEventListener("resize", handleResize);

    return () => {
        window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <div className="w-full absolute h-16 bg-zinc-100">
        <div className=" max-w-7xl p-4 md:p-0 mx-auto h-full">
          <div className="flex items-center h-full">
            <h1 className="text-xl font-bold text-gray-800">My App</h1>
            <div className="ml-auto flex items-center gap-4">
                <div>
                    <ul className="hidden gap-8 text-gray-500 md:flex">
                        {menu.map((item) => (
                            <li key={item.name}>
                                <NavLink
                                  to={item.href}
                                  className={({ isActive }) =>
                                    isActive
                                      ? "text-black"
                                      : "hover:text-black"
                                  }
                                >
                                    {item.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
              <Button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                Menu
              </Button>
              <Button className="hidden md:block" variant="outline">
                Login
              </Button>
            </div>
          </div>
          {isOpen && (
            <div className="fixed inset-0 z-50 bg-zinc-700 text-white">
              <div className="absolute top-4 right-0 h-16 items-center justify-end px-4">
                <div
                  className="h-14 w-14 bg-white flex items-center justify-center text-black rounded-lg"
                  onClick={() => setIsOpen(!isOpen)}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
