  import * as React from "react";
  import { Link } from "react-router-dom";
  import { CircleCheckIcon, CircleHelpIcon, CircleIcon, Menu, X } from "lucide-react";
  import { AuthContext } from "@/contexts/AuthContext";

  import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
  } from "@/components/ui/navigation-menu";

  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";

  import { Button } from "@/components/ui/button";

  export default function Nav() {
    const { user, logout, loading } = React.useContext(AuthContext);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    return (
      <div className="bg-cyan-900/80  shadow-sm border-b py-2 sticky top-0 left-0 w-full z-30 border-green-800">
        <div className="flex justify-between m-auto items-center w-full max-w-[170vh] h-fit px-4 py-2 ">
          <h1 className="text-xl font-semibold shrink-0 text-lime-400">
            Alumni <span className="text-amber-500 text-3xl">System</span>
          </h1>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-yellow-200 hover:text-yellow-400 p-2 transition-transform duration-300 hover:scale-110"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 animate-in spin-in-180 duration-300" />
            ) : (
              <Menu className="w-6 h-6 animate-in fade-in duration-300" />
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex justify-center items-center gap-8">
            {/* <NavigationMenu className="max-w-1/2 relative ">
              <NavigationMenuList className="flex-wrap gap-1">
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Home</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid  gap-2 md:w-[400px] lg:w-1xl lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-4 no-underline outline-hidden transition-all duration-200 select-none focus:shadow-md md:p-6"
                            href="/"
                          >
                            <div className="mb-2 text-lg font-medium sm:mt-4">
                              shadcn/ui
                            </div>
                            <p className="text-muted-foreground text-sm leading-tight">
                              Beautifully designed components built with Tailwind
                              CSS.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="/docs" title="Introduction">
                        Re-usable components built using Radix UI and Tailwind
                        CSS.
                      </ListItem>
                      <ListItem href="/docs/installation" title="Installation">
                        How to install dependencies and structure your app.
                      </ListItem>
                      <ListItem
                        href="/docs/primitives/typography"
                        title="Typography"
                      >
                        Styles for headings, paragraphs, lists, etc.
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                  
                </NavigationMenuItem>
                
              </NavigationMenuList>
            </NavigationMenu> */}
              <Link to="/" className="font-bold text-yellow-200 hover:text-yellow-400">
                    Home
                  </Link>
              <Link to="/directory" className="font-bold text-yellow-200 hover:text-yellow-400" >
                    Directory
                  </Link>
            
              <Link to="/events" className="font-bold text-yellow-200 hover:text-yellow-400">
                    Event
                  </Link>
             <Link to="/community" className="font-bold text-yellow-200 hover:text-yellow-400">
                    Community
                  </Link>
              <Link to="/donate" className="font-bold text-yellow-200 hover:text-yellow-400">
                    Donate
                  </Link>

            <div>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="bg-blue-300 border-blue-300">Open</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-blue-100" align="start">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link to="/personal" className="flex justify-between">
                          Profile
                          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Billing
                        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Settings
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                      </DropdownMenuItem>
                     </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>Team</DropdownMenuItem>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          Invite users
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem>Email</DropdownMenuItem>
                            <DropdownMenuItem>Message</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>More...</DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuItem>
                        New Team
                        <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/contact">Contact US</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Button onClick={logout}>Log out</Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm bg-green-600 text-white hover:bg-green-700 rounded-lg transition"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden absolute top-full left-0 w-full bg-cyan-800 border-t border-green-800 overflow-hidden transition-all duration-800 ease-in-out shadow-lg ${
            mobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className={`px-4 py-4 space-y-3 transform transition-all duration-500 ${
            mobileMenuOpen ? 'translate-y-0' : '-translate-y-4'
          }`}>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block font-bold text-yellow-200 hover:text-yellow-400 py-2 px-3 rounded hover:bg-cyan-700 transition"
              >
                Home
              </Link>
              <Link
                to="/directory"
                onClick={() => setMobileMenuOpen(false)}
                className="block font-bold text-yellow-200 hover:text-yellow-400 py-2 px-3 rounded hover:bg-cyan-700 transition"
              >
                Directory
              </Link>
              <Link
                to="/events"
                onClick={() => setMobileMenuOpen(false)}
                className="block font-bold text-yellow-200 hover:text-yellow-400 py-2 px-3 rounded hover:bg-cyan-700 transition"
              >
                Event
              </Link>
              <Link
                to="/community"
                onClick={() => setMobileMenuOpen(false)}
                className="block font-bold text-yellow-200 hover:text-yellow-400 py-2 px-3 rounded hover:bg-cyan-700 transition"
              >
                Community
              </Link>
              <Link
                to="/donate"
                onClick={() => setMobileMenuOpen(false)}
                className="block font-bold text-yellow-200 hover:text-yellow-400 py-2 px-3 rounded hover:bg-cyan-700 transition"
              >
                Donate
              </Link>

              <div className="pt-4 border-t border-green-700">
                {user ? (
                  <div className="space-y-2">
                    <Link
                      to="/personal"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-yellow-200 hover:text-yellow-400 py-2 px-3 rounded hover:bg-cyan-700 transition"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left text-yellow-200 hover:text-yellow-400 py-2 px-3 rounded hover:bg-cyan-700 transition"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-center bg-green-600 text-white hover:bg-green-700 rounded-lg transition"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
      </div>
    );
  }

  function ListItem({ title, children, href }) {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link to={href}>
            <div className="text-sm leading-none font-medium">{title}</div>
            <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
              {children}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  }
