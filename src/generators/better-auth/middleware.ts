import { writeFileWithDir } from "../../file-writer";

export async function generateMiddleware(
  framework: string,
  outputPath: string
): Promise<void> {
  if (framework === "nextjs") {
    const middleware = `import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard")

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
  ],
}
`;
    await writeFileWithDir(outputPath, middleware);
  }
}
