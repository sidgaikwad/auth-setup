# Next.js + Better Auth Example

This example shows how to use the generated Better Auth setup in a Next.js project.

## Setup

1. Run the CLI:

```bash
bunx @sidgaikwad/auth-setup
```

2. Choose Better Auth and your preferences

3. Add environment variables:

```bash
cp .env.example .env
# Fill in your values
```

4. Run migrations (if using ORM):

```bash
bun db:generate
bun db:migrate
```

5. Start the dev server:

```bash
bun dev
```

## Generated Files

- `src/lib/auth.ts` - Auth configuration
- `app/api/auth/[...all]/route.ts` - API endpoints
- `src/components/sign-in.tsx` - Sign in form
- `src/components/sign-up.tsx` - Sign up form
- `src/components/user-button.tsx` - User button
- `middleware.ts` - Route protection

## Usage

### Protected Page

```tsx
// app/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: headers() });

  if (!session) {
    redirect("/sign-in");
  }

  return <div>Welcome {session.user.name}!</div>;
}
```

### Sign In Page

```tsx
// app/sign-in/page.tsx
import { SignIn } from "@/components/sign-in";

export default function SignInPage() {
  return <SignIn />;
}
```

## Learn More

- [Better Auth Docs](https://better-auth.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
