type NavLink = {
  name: string
  href: string
}

const menu: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export default menu;