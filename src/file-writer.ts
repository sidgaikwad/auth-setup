import { mkdir, writeFile, appendFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

export async function writeFileWithDir(
  path: string,
  content: string
): Promise<void> {
  const absolutePath = resolve(process.cwd(), path);
  const dir = dirname(absolutePath);

  await mkdir(dir, { recursive: true });
  await writeFile(absolutePath, content, "utf-8");
}

export async function appendToFile(
  path: string,
  content: string
): Promise<void> {
  await appendFile(path, content, "utf-8");
}
