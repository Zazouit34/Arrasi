'use client';

import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { LogIn, UserCircle, Menu, Heart, Info, Mail } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import Image from "next/image"

export function Navbar() {
  const { user } = useAuth()

  const NavItems = () => (
    <>
      <NavigationMenuItem>
        <Link href="/favorites" legacyBehavior passHref>
          <NavigationMenuLink className="font-medium transition-colors hover:text-primary data-[active]:text-primary data-[active]:after:scale-100 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:w-full after:translate-y-3 after:bg-primary after:scale-0 after:transition-transform hover:after:scale-100">
            Favourite
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link href="/about" legacyBehavior passHref>
          <NavigationMenuLink className="font-medium transition-colors hover:text-primary data-[active]:text-primary data-[active]:after:scale-100 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:w-full after:translate-y-3 after:bg-primary after:scale-0 after:transition-transform hover:after:scale-100">
            About
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link href="/contact" legacyBehavior passHref>
          <NavigationMenuLink className="font-medium transition-colors hover:text-primary data-[active]:text-primary data-[active]:after:scale-100 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:w-full after:translate-y-3 after:bg-primary after:scale-0 after:transition-transform hover:after:scale-100">
            Contact
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-2">
              <UserCircle className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => signOut(auth)}
                className="cursor-pointer"
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login" legacyBehavior passHref>
            <NavigationMenuLink className="flex items-center space-x-2 font-medium">
              <LogIn className="h-5 w-5" />
              <span>Login</span>
            </NavigationMenuLink>
          </Link>
        )}
      </NavigationMenuItem>
    </>
  )

  const MobileNavItems = () => (
    <>
      <NavigationMenuItem className="w-full">
        <Link href="/favorites" legacyBehavior passHref>
          <NavigationMenuLink className="w-full font-medium transition-colors hover:text-primary flex items-center pl-4">
            <Heart className="h-5 w-5 min-w-[20px]" />
            <span className="ml-3">Favourite</span>
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem className="w-full">
        <Link href="/about" legacyBehavior passHref>
          <NavigationMenuLink className="w-full font-medium transition-colors hover:text-primary flex items-center pl-4">
            <Info className="h-5 w-5 min-w-[20px]" />
            <span className="ml-3">About</span>
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem className="w-full">
        <Link href="/contact" legacyBehavior passHref>
          <NavigationMenuLink className="w-full font-medium transition-colors hover:text-primary flex items-center pl-4">
            <Mail className="h-5 w-5 min-w-[20px]" />
            <span className="ml-3">Contact</span>
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem className="w-full">
        {user && (
          <NavigationMenuItem className="w-full">
            <Link href="/profile" legacyBehavior passHref>
              <NavigationMenuLink className="w-full font-medium transition-colors hover:text-primary flex items-center pl-4">
                <UserCircle className="h-5 w-5 min-w-[20px]" />
                <span className="ml-3">Profile</span>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        )}
      </NavigationMenuItem>
    </>
  )

  return (
    <div className="h-20 absolute w-full">
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] md:w-auto">
        <div className="rounded-full border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
          <div className="flex h-14 items-center justify-between md:justify-start">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo-wedbook.png"
                alt="Wedbook"
                width={60}
                height={60}
                className="object-contain"
                priority
              />
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <NavigationMenu>
                <NavigationMenuList className="space-x-6 ml-8">
                  <NavItems />
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger className="p-2">
                  <Menu className="h-5 w-5" />
                </SheetTrigger>
                <SheetContent side="right" className="w-72 flex flex-col">
                  <SheetTitle className="text-center mb-2">
                    <Image
                      src="/webbook.png"
                      alt="Wedbook"
                      width={120}
                      height={120}
                      className="object-contain mx-auto"
                    />
                  </SheetTitle>
                  <NavigationMenu orientation="vertical" className="w-full flex-1">
                    <NavigationMenuList className="flex flex-col space-y-4 w-full">
                      <MobileNavItems />
                    </NavigationMenuList>
                  </NavigationMenu>
                  {user && (
                    <button
                      onClick={() => signOut(auth)}
                      className="w-full mt-auto mb-8 font-medium text-red-500 hover:text-red-600 flex items-center justify-center py-2"
                    >
                      Sign Out
                    </button>
                  )}
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 