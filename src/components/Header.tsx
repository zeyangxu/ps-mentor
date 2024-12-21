import { Link, useLocation } from "react-router-dom";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export function Header() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="w-full bg-gradient-to-r from-secondary/80 to-background border-b border-primary/10 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <NavigationMenu className="mx-auto">
          <NavigationMenuList className="space-x-4">
            <NavigationMenuItem>
              <Link
                to="/"
                className={cn(
                  "px-4 py-2 rounded-md transition-all duration-200 hover:bg-primary/10",
                  isActive("/") && "bg-primary/20 text-primary"
                )}
              >
                主页
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                to="/editor"
                className={cn(
                  "px-4 py-2 rounded-md transition-all duration-200 hover:bg-primary/10",
                  isActive("/editor") && "bg-primary/20 text-primary"
                )}
              >
                文书编辑器
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                to="/login"
                className={cn(
                  "px-4 py-2 rounded-md transition-all duration-200 hover:bg-primary/10",
                  isActive("/login") && "bg-primary/20 text-primary"
                )}
              >
                登录
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}