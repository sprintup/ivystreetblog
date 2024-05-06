import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import Nav from "./(components)/Nav";
import { getServerSession } from "next-auth/next";
import { options } from "./api/auth/[...nextauth]/options";
import ClientProvider from "./ClientProvider";

export default async function RootLayout({ children }) {
  const session = await getServerSession(options);

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-primary text-white">
        <ClientProvider>
          <div className="flex flex-col min-h-screen bg-primary text-white">
            {/* Navbar */}
            <Nav session={session} />

            {/* Main Content */}
            <main className="flex-grow py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
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
        </ClientProvider>
      </body>
    </html>
  );
}
