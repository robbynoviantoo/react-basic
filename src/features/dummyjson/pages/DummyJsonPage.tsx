import { useEffect, useState } from "react";
import type { ElementType } from "react";
import { Database, KeyRound, ShoppingCart, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";

import AddCartPanel from "../components/AddCartPanel";
import AuthPanel from "../components/AuthPanel";
import CartsPanel from "../components/CartsPanel";
import UsersPanel from "../components/UsersPanel";

type DummyJsonSection = "users" | "auth" | "carts" | "add-cart";

const sections: {
  id: DummyJsonSection;
  label: string;
  description: string;
  icon: ElementType;
}[] = [
  {
    id: "users",
    label: "Users",
    description: "Get all, search, sort",
    icon: UsersRound,
  },
  {
    id: "auth",
    label: "Auth",
    description: "Login dan current user",
    icon: KeyRound,
  },
  {
    id: "carts",
    label: "Carts",
    description: "All carts dan user carts",
    icon: Database,
  },
  {
    id: "add-cart",
    label: "Add Cart",
    description: "POST carts/add",
    icon: ShoppingCart,
  },
];

const DummyJsonPage = () => {
  const [activeSection, setActiveSection] = useState<DummyJsonSection>("users");

  useEffect(() => {
    document.title = "DummyJSON Workspace";
  }, []);

  return (
    <main className="min-h-screen bg-muted/30 py-10">
      <section className="mx-auto mt-15 max-w-9/10 space-y-5">
        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <div className="mb-4">
            <h1 className="text-2xl font-bold tracking-tight">
              DummyJSON Workspace
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Modul referensi untuk users, auth, carts, dan add cart dengan foldering yang mudah dikembangkan.
            </p>
          </div>

          <div className="grid gap-2 md:grid-cols-4">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;

              return (
                <Button
                  key={section.id}
                  type="button"
                  variant={isActive ? "default" : "outline"}
                  className="h-auto justify-start p-3"
                  onClick={() => setActiveSection(section.id)}
                >
                  <Icon />
                  <span className="text-left">
                    <span className="block font-medium">{section.label}</span>
                    <span className="block text-xs opacity-75">
                      {section.description}
                    </span>
                  </span>
                </Button>
              );
            })}
          </div>
        </div>

        {activeSection === "users" ? <UsersPanel /> : null}
        {activeSection === "auth" ? <AuthPanel /> : null}
        {activeSection === "carts" ? <CartsPanel /> : null}
        {activeSection === "add-cart" ? <AddCartPanel /> : null}
      </section>
    </main>
  );
};

export default DummyJsonPage;
