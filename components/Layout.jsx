import Image from "next/image";
import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-primary text-white">
      {/* Navbar */}
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
            <div className="flex space-x-4">
              <Link href="/bookshelf" className="hover:text-secondary">
                Bookshelf
              </Link>
              <Link href="/resources" className="hover:text-secondary">
                Resources
              </Link>
              <Link href="/about" className="hover:text-secondary">
                About
              </Link>
              <Link href="/register" className="hover:text-accent">
                Register
              </Link>
              <Link href="/login" className="hover:text-accent">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
