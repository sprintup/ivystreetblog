// app/(components)/Nav.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const Nav = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isActive = (href) => {
    return pathname === href;
  };

  return (
    <header className="">
      <nav className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Logo"
                width={80}
                height={80}
                className="rounded-full"
              />
            </Link>

            {/* Nav Links */}
            <div className="flex space-x-4 items-center">
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
        </div>
      </nav>
    </header>
  );
};

export default Nav;
