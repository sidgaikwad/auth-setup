export function getAPIRouteTemplate(framework: string): string {
  if (framework === 'nextjs') {
    return `import { auth } from "@/lib/auth"\n\nexport const { GET, POST } = auth.handler\n`
  }
  
  return `import { auth } from "~/lib/auth"\nimport type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"\n\nexport async function loader({ request }: LoaderFunctionArgs) {\n  return auth.handler(request)\n}\n\nexport async function action({ request }: ActionFunctionArgs) {\n  return auth.handler(request)\n}\n`
}