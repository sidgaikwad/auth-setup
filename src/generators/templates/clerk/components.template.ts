export function getClerkSignInTemplate(): string {
  return `import { SignIn as ClerkSignIn } from "@clerk/nextjs"

export function SignIn() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <ClerkSignIn />
    </div>
  )
}
`;
}

export function getClerkUserButtonTemplate(): string {
  return `import { UserButton as ClerkUserButton } from "@clerk/nextjs"

export function UserButton() {
  return <ClerkUserButton />
}
`;
}
