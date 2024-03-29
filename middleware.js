export function middleware(request) {
  const currentUser = request.cookies.get("currentUser")?.value;
  const unprotectedRoutes = [
    "/",
    "/bookshelf",
    "/resources",
    "/register",
    "/login",
    "/terms",
  ];

  const isBooklistRoute = request.nextUrl.pathname.startsWith("/booklist/");

  if (
    currentUser &&
    !request.nextUrl.pathname.startsWith("/dashboard") &&
    !unprotectedRoutes.includes(request.nextUrl.pathname) &&
    !isBooklistRoute
  ) {
    return Response.redirect(new URL("/dashboard", request.url));
  }

  if (
    !currentUser &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !unprotectedRoutes.includes(request.nextUrl.pathname) &&
    !isBooklistRoute
  ) {
    return Response.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
