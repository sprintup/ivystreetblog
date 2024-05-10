// app/(components)/Nav.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const Nav = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href) => {
    return pathname === href;
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-primary sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
            </Link>
          </div>
          <div className="hidden md:block">
            {/* Nav Links */}
            <div className="ml-10 flex items-baseline space-x-4">
              {session && (
                <>
                  <span className="text-yellow">
                    Welcome, {session.user.name}!
                  </span>
                  <Link
                    href="/bookshelf"
                    className={`text-yellow hover:text-orange focus:text-orange ${
                      isActive("/bookshelf") ? "font-bold" : ""
                    }`}
                  >
                    Bookshelf
                  </Link>
                  <Link
                    href="/profile"
                    className={`text-yellow hover:text-orange focus:text-orange ${
                      isActive("/profile") ? "font-bold" : ""
                    }`}
                  >
                    Profile
                  </Link>
                </>
              )}
              <Link
                href="/public-booklists"
                className={`text-yellow hover:text-orange focus:text-orange ${
                  isActive("/public-booklists") ? "font-bold" : ""
                }`}
              >
                Public Booklists
              </Link>
              <Link
                href="/"
                className={`text-yellow hover:text-orange focus:text-orange ${
                  isActive("/") ? "font-bold" : ""
                }`}
              >
                About
              </Link>
              <Link
                href="/resources"
                className={`text-yellow hover:text-orange focus:text-orange ${
                  isActive("/resources") ? "font-bold" : ""
                }`}
              >
                Resources
              </Link>

              <Link
                href="/register"
                className={`text-yellow hover:text-orange focus:text-orange ${
                  isActive("/register") ? "font-bold" : ""
                }`}
              >
                Register
              </Link>
              {session ? (
                <Link
                  href="/api/auth/signout?callbackUrl=/"
                  className="text-yellow hover:text-orange focus:text-orange"
                >
                  Logout
                </Link>
              ) : (
                <Link
                  href="/api/auth/signin?callbackUrl=/bookshelf"
                  className="text-yellow hover:text-orange focus:text-orange"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-yellow hover:text-orange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-yellow"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed. */}
              <svg
                className={`${isOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open. */}
              <svg
                className={`${isOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu, show/hide based on menu state. */}
      <div className={`${isOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {session && (
            <>
              <span className="text-yellow block px-3 py-2">
                Welcome, {session.user.name}!
              </span>
              <Link
                href="/bookshelf"
                className={`text-yellow hover:text-orange focus:text-orange block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/bookshelf") ? "bg-primary" : ""
                }`}
              >
                Bookshelf
              </Link>
              <Link
                href="/profile"
                className={`text-yellow hover:text-orange focus:text-orange block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/profile") ? "bg-primary" : ""
                }`}
              >
                Profile
              </Link>
            </>
          )}
          <Link
            href="/public-booklists"
            className={`text-yellow hover:text-orange focus:text-orange block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/public-booklists") ? "bg-primary" : ""
            }`}
          >
            Public Booklists
          </Link>
          <Link
            href="/"
            className={`text-yellow hover:text-orange focus:text-orange block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/") ? "bg-primary" : ""
            }`}
          >
            About
          </Link>
          <Link
            href="/resources"
            className={`text-yellow hover:text-orange focus:text-orange block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/resources") ? "bg-primary" : ""
            }`}
          >
            Resources
          </Link>

          <Link
            href="/register"
            className={`text-yellow hover:text-orange focus:text-orange block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/register") ? "bg-primary" : ""
            }`}
          >
            Register
          </Link>
          {session ? (
            <Link
              href="/api/auth/signout?callbackUrl=/"
              className="text-yellow hover:text-orange focus:text-orange block px-3 py-2 rounded-md text-base font-medium"
            >
              Logout
            </Link>
          ) : (
            <Link
              href="/api/auth/signin?callbackUrl=/bookshelf"
              className="text-yellow hover:text-orange focus:text-orange block px-3 py-2 rounded-md text-base font-medium"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Nav;
