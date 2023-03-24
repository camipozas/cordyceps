import { request } from "@octokit/request";
import { env } from "./env/env";

export const getAllRepositories = async () => {
  const response = await request("GET /orgs/{org}/repos", {
    org: env.GITHUB_ORG,
    headers: {
      authorization: `token ${env.GITHUB_TOKEN}`,
    },
    per_page: 100,
  });

  const repoData = response.data;
  const repoNames = repoData.map((repo) => repo.name);
  return repoNames.filter((repoName: string) => repoName.startsWith("mach-"));
};

export const accessibleRepos = async (repoNames: string[]) => {
  const accessibleRepos = [];

  for (const repoName of repoNames) {
    try {
      const repoInfo = await request("GET /repos/{owner}/{repo}", {
        owner: env.GITHUB_ORG,
        repo: repoName,
        headers: {
          authorization: `token ${env.GITHUB_TOKEN}`,
        },
      });
      accessibleRepos.push(repoName);
    } catch (error) {
      console.log(`Error: ${repoName} is not accessible`);
    }
  }

  return accessibleRepos;
};
