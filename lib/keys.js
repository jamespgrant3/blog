import { readFile } from "fs/promises";
import matter from "gray-matter";
import path from "path";
import { remark } from "remark";
import html from "remark-html";

const keysDirectory = path.join(process.cwd(), "pages/keys/markdown");

export async function getKeysPage() {
  const file = (await readFile(`${keysDirectory}/index.md`)).toString();

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(file);

  const processedContent = await remark()
    .use(html, { sanitize: false })
    .process(matterResult.content);

  const content = processedContent.toString();

  return {
    content,
    ...matterResult.data,
  };
}
