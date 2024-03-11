// components/Layout.js
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
              <Link
                href="/bookshelf"
                className="text-yellow hover:text-orange focus:text-orange"
              >
                Bookshelf
              </Link>
              <Link
                href="/resources"
                className="text-yellow hover:text-orange focus:text-orange"
              >
                Resources
              </Link>
              <Link
                href="/"
                className="text-yellow hover:text-orange focus:text-orange"
              >
                About
              </Link>
              <Link
                href="/register"
                className="text-yellow hover:text-orange focus:text-orange"
              >
                Register
              </Link>
              <Link
                href="/login"
                className="text-yellow hover:text-orange focus:text-orange"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
      </main>

      {/* Footer */}
      <footer className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} See{" "}
              <Link
                href="/terms"
                className="text-yellow hover:text-orange focus:text-orange"
              >
                terms of service
              </Link>{" "}
              or{" "}
              <Link
                href="https://github.com/sprintup/ivystreetblog"
                className="text-yellow hover:text-orange focus:text-orange"
              >
                edit on github
              </Link>
              .
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
