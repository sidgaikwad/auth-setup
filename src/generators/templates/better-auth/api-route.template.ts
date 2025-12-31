export function getAPIRouteTemplate(framework: string): string {
  if (framework === 'nextjs') {
    return `import { auth } from "@/lib/auth"

export const { GET, POST } = auth.handler
`
  }

  return `import { auth } from "~/lib/auth"
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"

export async function loader({ request }: LoaderFunctionArgs) {
  return auth.handler(request)
}

export async function action({ request }: ActionFunctionArgs) {
  return auth.handler(request)
}
`
}
