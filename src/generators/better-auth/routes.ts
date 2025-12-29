import { writeFileWithDir } from "../../file-writer";

export async function generateAPIRoute(
  framework: string,
  outputPath: string
): Promise<void> {
  if (framework === "nextjs") {
    const route = `import { auth } from "@/lib/auth"

export const { GET, POST } = auth.handler
`;
    await writeFileWithDir(outputPath, route);
  } else if (framework === "remix") {
    const route = `import { auth } from "~/lib/auth"
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"

export async function loader({ request }: LoaderFunctionArgs) {
  return auth.handler(request)
}

export async function action({ request }: ActionFunctionArgs) {
  return auth.handler(request)
}
`;
    await writeFileWithDir("app/routes/api.auth.$.tsx", route);
  }
}
