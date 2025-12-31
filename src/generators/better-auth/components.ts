import { writeFileWithDir } from '../../file-writer'
import {
  getSignInTemplate,
  getSignUpTemplate,
  getUserButtonTemplate,
} from '../templates/better-auth/components/sign-in.template'
import type { DetectedSetup } from '../../detector'

export async function generateComponents(
  componentsDir: string,
  detected: DetectedSetup
): Promise<void> {
  // Generate components
  await writeFileWithDir(`${componentsDir}/sign-in.tsx`, getSignInTemplate(detected.srcDir))
  await writeFileWithDir(`${componentsDir}/sign-up.tsx`, getSignUpTemplate(detected.srcDir))
  await writeFileWithDir(`${componentsDir}/user-button.tsx`, getUserButtonTemplate(detected.srcDir))

  // Generate Next.js pages for sign-in and sign-up
  if (detected.framework === 'nextjs') {
    await generateAuthPages(detected.srcDir)
  }
}

async function generateAuthPages(srcDir: string | null): Promise<void> {
  const componentsPath =
    srcDir === 'app' ? '@/components' : srcDir === 'src' ? '@/components' : '../components'

  // Sign-in page
  const signInPage = `import { SignIn } from "${componentsPath}/sign-in"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignIn />
    </div>
  )
}
`

  // Sign-up page
  const signUpPage = `import { SignUp } from "${componentsPath}/sign-up"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignUp />
    </div>
  )
}
`

  // Dashboard page (protected example)
  const dashboardPage = `import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { UserButton } from "${componentsPath}/user-button"

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: headers() })

  if (!session) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <UserButton />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Welcome, {session.user.name || session.user.email}!</h2>
          <p className="text-gray-600">You are successfully authenticated.</p>
        </div>
      </div>
    </div>
  )
}
`

  // Generate pages
  await writeFileWithDir('app/sign-in/page.tsx', signInPage)
  await writeFileWithDir('app/sign-up/page.tsx', signUpPage)
  await writeFileWithDir('app/dashboard/page.tsx', dashboardPage)
}
