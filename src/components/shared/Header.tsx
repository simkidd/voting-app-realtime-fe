import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { HourglassIcon, LogOutIcon, MenuIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader } from "../ui/sheet";
import { ModeToggle } from "../mode-toggle";

const Header = () => {
  const { logout, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="w-full border-b sticky top-0 z-50 bg-background">
      <div className="w-full flex items-center justify-between container mx-auto px-4 py-2 h-16">
        <div>LOGO</div>
        <div className="flex items-center gap-4">
          <p>Hello, {user?.name}</p>
          <ModeToggle />
          {!isMobile ? (
            <ul className="flex items-center gap-4">
              <li>
                <Button
                  variant={"destructive"}
                  className="cursor-pointer rounded-sm w-full justify-start"
                  onClick={logout}
                >
                  <LogOutIcon />
                  <span>Log out</span>
                </Button>
              </li>
            </ul>
          ) : (
            <>
              <Button
                size="icon"
                className="cursor-pointer rounded-sm"
                onClick={() => setIsMenuOpen(true)}
              >
                <MenuIcon />
              </Button>

              <Sheet
                open={isMenuOpen}
                onOpenChange={() => setIsMenuOpen(!isMenuOpen)}
              >
                <SheetContent className="w-2/3">
                  <SheetHeader>LOGO</SheetHeader>
                  <Separator />
                  <ul>
                    <li className="px-4">
                      <Link to={"/results"}>
                        <Button
                          variant={"ghost"}
                          className="w-full justify-start cursor-pointer"
                        >
                          <HourglassIcon />
                          <span>Election Results</span>
                        </Button>
                      </Link>
                    </li>
                  </ul>
                  {/* logout */}
                  <Separator className="mt-auto mb-0" />
                  <div className="px-4 py-4">
                    <Button
                      variant={"destructive"}
                      className="cursor-pointer rounded-sm w-full justify-start"
                      onClick={logout}
                    >
                      <LogOutIcon />
                      <span>Log out</span>
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
