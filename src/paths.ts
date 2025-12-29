export interface ResolvedPaths {
  authConfig: string; // lib/auth.ts
  apiRoute: string; // app/api/auth/[...all]/route.ts
  middleware: string; // middleware.ts
  components: string; // components/ or app/components/
  envExample: string; // .env.example
}

export function resolvePaths(srcDir: string | null): ResolvedPaths {
  const base = srcDir || ".";

  return {
    authConfig: `${base}/lib/auth.ts`,
    apiRoute: "app/api/auth/[...all]/route.ts",
    middleware: "middleware.ts",
    components: srcDir ? `${srcDir}/components` : "components",
    envExample: ".env.example",
  };
}
