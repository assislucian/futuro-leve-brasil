import {
  Home,
  Settings,
  Calculator,
  Target,
  BarChart3,
  CreditCard,
  LayoutDashboard,
  ListChecks
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";
import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/components/ui/theme-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Orçamentos",
    url: "/budgets",
    icon: Calculator,
  },
  {
    title: "Metas",
    url: "/goals",
    icon: Target,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Configurações",
    url: "/settings",
    icon: Settings,
  },
];

const AppSidebar = () => {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { setTheme } = useTheme();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <LayoutDashboard className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-64">
        <SheetHeader className="space-y-2">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Explore as funcionalidades do Plenus para organizar suas finanças.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {user ? (
                <Avatar>
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              ) : (
                <Skeleton className="h-9 w-9 rounded-full" />
              )}
              <div>
                <h3 className="text-sm font-medium">{user?.user_metadata?.full_name || user?.email}</h3>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid gap-4 py-4">
          <div className="flex items-center">
            <Switch id="airplane-mode" onCheckedChange={(checked) => checked ? setTheme("dark") : setTheme("light")} />
            <label htmlFor="airplane-mode" className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Modo Noturno
            </label>
          </div>
        </div>
        <div className="grid gap-4">
          {items.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              className={({ isActive }) =>
                `flex items-center space-x-2 rounded-md p-2 text-sm font-medium hover:underline ${
                  isActive ? "bg-secondary text-foreground" : "text-muted-foreground"
                }`
              }
              onClick={() => setOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AppSidebar;

import {
  MoreHorizontal,
  User,
} from "lucide-react";
