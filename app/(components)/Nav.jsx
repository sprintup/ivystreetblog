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

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="bg-secondary sticky top-0 z-50 border-b-2 border-solid border-accent-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link
              href="/"
              onClick={closeMenu}
              style={{ textDecoration: "none" }}
            >
              <div className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
            </Link>
            <Link
              href="/public-bookshelf"
              onClick={closeMenu}
              style={{ textDecoration: "none" }}
            >
              <div className="flex items-center">
                <span className="ml-2 text-yellow font-bold">
                  Ivy Street Blog
                </span>
              </div>
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
                    href="/public-bookshelf"
                    className={`text-yellow hover:text-orange focus:text-orange ${
                      isActive("/public-bookshelf") ? "font-bold" : ""
                    }`}
                    onClick={closeMenu}
                  >
                    Public Bookshelf
                  </Link>
                  <Link
                    href="/my-bookshelf"
                    className={`text-yellow hover:text-orange focus:text-orange ${
                      isActive("/my-bookshelf") ? "font-bold" : ""
                    }`}
                    onClick={closeMenu}
                  >
                    My Bookshelf
                  </Link>
                  <Link
                    href="/reading-list"
                    className={`text-yellow hover:text-orange focus:text-orange ${
                      isActive("/reading-list") ? "font-bold" : ""
                    }`}
                    onClick={closeMenu}
                  >
                    My Reading List
                  </Link>
                  <Link
                    href="/profile"
                    className={`text-yellow hover:text-orange focus:text-orange ${
                      isActive("/profile") ? "font-bold" : ""
                    }`}
                    onClick={closeMenu}
                  >
                    Profile
                  </Link>
                </>
              )}
              {!session && (
                <>
                  <Link
                    href="/public-bookshelf"
                    className={`text-yellow hover:text-orange focus:text-orange ${
                      isActive("/public-bookshelf") ? "font-bold" : ""
                    }`}
                    onClick={closeMenu}
                  >
                    Public Booklists
                  </Link>
                  <Link
                    href="/"
                    className={`text-yellow hover:text-orange focus:text-orange ${
                      isActive("/") ? "font-bold" : ""
                    }`}
                    onClick={closeMenu}
                  >
                    About
                  </Link>
                </>
              )}
              {!session && (
                <Link
                  href="/register"
                  className={`text-yellow hover:text-orange focus:text-orange ${
                    isActive("/register") ? "font-bold" : ""
                  }`}
                  onClick={closeMenu}
                >
                  Register
                </Link>
              )}
              {session ? (
                <Link
                  href="/api/auth/signout?callbackUrl=/"
                  className="text-yellow hover:text-orange focus:text-orange"
                  onClick={closeMenu}
                >
                  Logout
                </Link>
              ) : (
                <Link
                  href="/api/auth/signin?callbackUrl=/my-bookshelf"
                  className="text-yellow hover:text-orange focus:text-orange"
                  onClick={closeMenu}
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
                href="/public-bookshelf"
                className={`text-yellow hover:text-orange focus:text-orange block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/public-bookshelf") ? "bg-primary" : ""
                }`}
                onClick={closeMenu}
              >
                Public Bookshelf
              </Link>
              <Link
                href="/my-bookshelf"
                className={`text-yellow hover:text-orange focus:text-orange block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/my-bookshelf") ? "bg-primary" : ""
                }`}
                onClick={closeMenu}
              >
                My Bookshelf
              </Link>
              <Link
                href="/reading-list"
                className={`text-yellow hover:text-orange focus:text-orange block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/reading-list") ? "bg-primary" : ""
                }`}
                onClick={closeMenu}
              >
                My Reading List
              </Link>
              <Link
                href="/profile"
                className={`text-yellow hover:text-orange focus:text-orange block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/profile") ? "bg-primary" : ""
                }`}
                onClick={closeMenu}
              >
                Profile
              </Link>
            </>
          )}
          {!session && (
            <>
              <Link
                href="/public-bookshelf"
                className={`text-yellow hover:text-orange focus:text-orange block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/public-bookshelf") ? "bg-primary" : ""
                }`}
                onClick={closeMenu}
              >
                Public Booklists
              </Link>
              <Link
                href="/"
                className={`text-yellow hover:text-orange focus:text-orange block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/") ? "bg-primary" : ""
                }`}
                onClick={closeMenu}
              >
                About
              </Link>
            </>
          )}
          {!session && (
            <Link
              href="/register"
              className={`text-yellow hover:text-orange focus:text-orange block px-3 py-2 rounded-md text-base font-medium ${
                isActive("/register") ? "bg-primary" : ""
              }`}
              onClick={closeMenu}
            >
              Register
            </Link>
          )}
          {session ? (
            <Link
              href="/api/auth/signout?callbackUrl=/"
              className="text-yellow hover:text-orange focus:text-orange block px-3 py-2 rounded-md text-base font-medium"
              onClick={closeMenu}
            >
              Logout
            </Link>
          ) : (
            <Link
              href="/api/auth/signin?callbackUrl=/my-bookshelf"
              className="text-yellow hover:text-orange focus:text-orange block px-3 py-2 rounded-md text-base font-medium"
              onClick={closeMenu}
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
