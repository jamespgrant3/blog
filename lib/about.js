import { readFile } from "fs/promises";
import matter from "gray-matter";
import path from "path";
import { remark } from "remark";
import html from "remark-html";

const aboutDirectory = path.join(process.cwd(), "pages/about/markdown");

export async function getAboutPage() {
  const file = (await readFile(`${aboutDirectory}/index.md`)).toString();

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
