import { NextResponse, type NextRequest } from "next/server";
import { verifySession, ADMIN_COOKIE } from "@/lib/admin/auth";

/**
 * Gates /admin/* routes. The login page and its API endpoint are
 * excluded via the matcher below.
 */
export function middleware(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const result = verifySession(token);
  if (!result.ok) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    // preserve where the user was trying to go (only the path, not query — keep clean)
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  // Node.js runtime needed for `node:crypto` in verifySession.
  runtime: "nodejs",
  // Match every /admin path except the login page itself.
  // (API routes under /api/admin/* are protected by requireAdmin() inside
  //  each handler, not by middleware — middleware would also need to allow
  //  the login API through, which complicates the matcher.)
  matcher: ["/admin/((?!login$).*)", "/admin"],
};
