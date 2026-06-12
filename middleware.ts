import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth({
  pages: {
    signIn: "/login"
  },
  callbacks: {
    authorized: ({ token, req }) => {
      // Allow /dashboard/orders without auth for demo purposes
      if (req.nextUrl.pathname === "/dashboard/orders") return true;
      return Boolean(token);
    }
  }
});

export const config = {
  matcher: ["/checkout", "/dashboard/:path*"]
};
