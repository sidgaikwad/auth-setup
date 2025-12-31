# 🔐 @sidgaikwad/auth-setup

> Production-ready authentication setup in 2 minutes

[![npm version](https://badge.fury.io/js/%40sidgaikwad%2Fauth-setup.svg)](https://www.npmjs.com/package/@sidgaikwad/auth-setup)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Setup Better Auth or Clerk with one command. Zero config, framework-agnostic, production-ready.

## ✨ Features

- 🎯 **Multiple Providers** - Better Auth, Clerk (more coming)
- 🔐 **Auth Methods** - Email/Password, Google, GitHub OAuth
- 🗄️ **ORM Integration** - Auto-detects Drizzle, Prisma
- 🎨 **UI Components** - Pre-built Sign In, Sign Up, User Button
- 🛡️ **Route Protection** - Middleware for protected routes
- ⚡ **Framework Agnostic** - Next.js, Remix, and more
- 📦 **Zero Config** - Smart defaults, works out of the box

## 🚀 Quick Start

```bash
bunx @sidgaikwad/auth-setup
```

Answer a few questions and you're done! 🎉

## 📦 What Gets Generated

### For Better Auth:

```
your-project/
├── src/lib/auth.ts              # Auth configuration
├── app/api/auth/[...all]/route.ts  # API endpoints
├── src/components/
│   ├── sign-in.tsx              # Sign in form
│   ├── sign-up.tsx              # Sign up form
│   └── user-button.tsx          # User menu
├── middleware.ts                # Route protection
├── .env.example                 # Environment variables
└── src/db/schema.ts            # Auth tables (if ORM detected)
```

### For Clerk:

```
your-project/
├── middleware.ts                # Clerk middleware
├── src/components/
│   ├── sign-in.tsx              # Clerk sign-in wrapper
│   └── user-button.tsx          # Clerk user button
└── .env.example                 # Clerk API keys
```

## 🎯 Usage

### 1. Run the CLI

```bash
bunx @sidgaikwad/auth-setup
```

### 2. Choose your provider

```
◇ Select your auth provider
│ ❯ Better Auth (Type-safe, modern, self-hosted)
│   Clerk (Managed service, beautiful UI)

◇ Select authentication methods
│ ◉ Email + Password
│ ◉ Google OAuth
│ ◯ GitHub OAuth

◇ Generate UI components?
│ Yes

◇ Generate middleware for route protection?
│ Yes
```

### 3. Configure environment variables

```bash
# Better Auth
BETTER_AUTH_SECRET=your-secret-here
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-id
GOOGLE_CLIENT_SECRET=your-google-secret

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-key
CLERK_SECRET_KEY=your-secret
```

### 4. Run migrations (if using Better Auth with ORM)

```bash
bun db:generate
bun db:migrate
```

### 5. Start your app!

```bash
bun dev
```

## 💻 Usage in Your App

### Server Component (Better Auth)

```tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Page() {
  const session = await auth.api.getSession({ headers: headers() });

  if (!session) {
    return <div>Not logged in</div>;
  }

  return <div>Welcome {session.user.name}!</div>;
}
```

### Client Component

```tsx
import { SignIn } from "@/components/sign-in";

export default function SignInPage() {
  return <SignIn />;
}
```

### Using Clerk

```tsx
import { UserButton } from "@/components/user-button";

export default function Navbar() {
  return (
    <nav>
      <UserButton />
    </nav>
  );
}
```

## 🔧 Supported Stacks

### Frameworks

- ✅ Next.js 13+ (App Router)
- ✅ Remix
- 🔄 SvelteKit (coming soon)

### ORMs

- ✅ Drizzle
- ✅ Prisma
- 🔄 Kysely (coming soon)

### Databases

- ✅ PostgreSQL
- ✅ MySQL
- ✅ SQLite

## 🛠️ CLI Options

```bash
# Use with specific package manager
npx @sidgaikwad/auth-setup
bunx @sidgaikwad/auth-setup
pnpm dlx @sidgaikwad/auth-setup
```

## 📚 Examples

Check out the [examples](https://github.com/sidgaikwad/auth-setup/tree/main/examples) directory:

- Next.js + Better Auth + Drizzle
- Next.js + Clerk
- Remix + Better Auth + Prisma

## 🤝 Integration with @sidgaikwad/orm-setup

Works seamlessly with [@sidgaikwad/orm-setup](https://www.npmjs.com/package/@sidgaikwad/orm-setup):

```bash
# 1. Setup database
bunx @sidgaikwad/orm-setup

# 2. Setup auth (auto-detects ORM!)
bunx @sidgaikwad/auth-setup
```

## 🐛 Troubleshooting

### "Database connection failed"

Make sure `DATABASE_URL` is set in your `.env` file.

### "OAuth redirect URI mismatch"

Check your OAuth provider settings:

- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

### "Session not found"

Run migrations to create auth tables:

```bash
bun db:generate
bun db:migrate
```

## 🗺️ Roadmap

### v1.1

- [ ] Lucia support
- [ ] NextAuth.js support
- [ ] Magic links
- [ ] Email verification UI

### v2.0

- [ ] Supabase Auth
- [ ] Stack Auth
- [ ] SvelteKit support
- [ ] 2FA setup

## 🤝 Contributing

Contributions are welcome! Please check out our [Contributing Guide](CONTRIBUTING.md).

## 📄 License

MIT © [Siddharth Gaikwad](https://github.com/sidgaikwad)

## 🔗 Links

- [Documentation](https://github.com/sidgaikwad/auth-setup)
- [npm Package](https://www.npmjs.com/package/@sidgaikwad/auth-setup)
- [Report Issues](https://github.com/sidgaikwad/auth-setup/issues)
- [Better Auth Docs](https://better-auth.com/docs)
- [Clerk Docs](https://clerk.com/docs)

---

Made with ❤️ by [Siddharth Gaikwad](https://github.com/sidgaikwad)
