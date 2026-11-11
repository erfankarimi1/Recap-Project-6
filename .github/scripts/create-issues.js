import { readdirSync, readFileSync } from "fs";
import path from "path";

export default async function createIssues({ github, context, core }) {
  const templatesDir = path.join(process.cwd(), ".github", "templates");

  const files = readdirSync(templatesDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const content = readFileSync(path.join(templatesDir, file), "utf-8");
      const { title, body } = getTitleAndBody(content);

      return {
        path: file,
        title,
        body,
      };
    })
    .filter((file) => {
      if (file.title) return true;

      core.warning(`No h1 title found in ${file.path}`);
      return false;
    });

  // Not inside the try block below: if the existing issues cannot be listed,
  // the run must fail instead of creating duplicates.
  const existingTitles = await getExistingTitles({ github, context });

  for (const { title, body } of files) {
    if (existingTitles.has(title)) {
      core.notice(`Issue already exists, skipped: ${title}`);
      continue;
    }

    try {
      await github.rest.issues.create({
        ...context.repo,
        title,
        body,
      });

      core.notice(`Issue created: ${title}`);
    } catch (error) {
      core.error(`Error creating issue ${title}`);
    }
  }
}

// Titles of all issues, open and closed. The issues API also returns pull
// requests, which are not issues and are left out.
async function getExistingTitles({ github, context }) {
  const issues = await github.paginate(github.rest.issues.listForRepo, {
    ...context.repo,
    state: "all",
    per_page: 100,
  });

  return new Set(
    issues.filter((issue) => !issue.pull_request).map((issue) => issue.title)
  );
}

function getTitleAndBody(content) {
  const titleMatch = content.trim().match(/# (.*)/)[1];

  if (!titleMatch) {
    return { title: null, body: content };
  }

  const title = titleMatch.trim();
  const body = content.replace(/# .*/, "").trim();

  return { title, body };
}
