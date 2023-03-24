import { Octokit } from "@octokit/core";
import { env } from "./env/env";
import { paginateRest } from "@octokit/plugin-paginate-rest";

const MyOctokit = Octokit.plugin(paginateRest);

const octokit = new MyOctokit({
  auth: env.GITHUB_TOKEN,
});

export const getAllRepositories = async () => {
  const repoData = await octokit.paginate(
    "GET /orgs/{org}/repos",
    {
      org: env.GITHUB_ORG,
    },
    (response) => response.data.map((repo) => repo.name)
  );

  return repoData.filter((repo) => repo.startsWith("mach-"));
};

export const accessibleRepos = async (repoNames: string[]) => {
  const accessibleRepos = [];

  for (const repoName of repoNames) {
    try {
      await octokit.request("GET /repos/{owner}/{repo}", {
        owner: env.GITHUB_ORG,
        repo: repoName,
      });
      accessibleRepos.push(repoName);
    } catch (error) {
      console.log(`Error: ${repoName} is not accessible`);
    }
  }

  return accessibleRepos;
};
