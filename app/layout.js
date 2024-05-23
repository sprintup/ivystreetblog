import "./globals.css";
import Nav from "@components/Nav";
import Footer from "@components/Footer";
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
            <main className="flex-grow py-8 mb-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>

            {/* Footer */}
            <Footer />
          </div>
        </ClientProvider>
      </body>
    </html>
  );
}