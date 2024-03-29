import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "posts");

function getPosts() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
    };
  });
}

export function getAllTags() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

export function getTags() {
  const posts = getPosts();
  const t = new Set();

  posts.forEach(({ tags }) => {
    if (tags) {
      tags.forEach((tag) => t.add(tag));
    }
  });

  return [...t].map((a) => ({
    params: {
      id: a,
    },
  }));
}

export function getPostsForTag(id) {
  const posts = getPosts();
  if (!posts) {
    return [];
  }

  return posts.filter((p) => p.tags?.includes(id));
}
