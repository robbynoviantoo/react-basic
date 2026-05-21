type NavLink = {
  name: string
  href: string
}

const menu: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "MCS", href: "/mcs" },
  { name: "Products", href: "/products" },
  { name: "DummyJSON", href: "/dummy-json" },
]

export default menu;
