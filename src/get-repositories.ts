import { request } from '@octokit/request';
import { env } from './env/env';

/**
 * It makes a request to the GitHub API to get a list of all the repositories in the organization, and
 * then filters out the ones that don't start with "your-filter-prefix-" and is not empty.
 * @returns An array of strings.
 */
export const getAllRepositories = async () => {
  const response = await request('GET /orgs/{org}/repos', {
    org: env.GITHUB_ORG,
    headers: {
      authorization: `token ${env.GITHUB_TOKEN}`,
    },
    per_page: 100,
  });

  const repoData = response.data;
  if (!Array.isArray(repoData) || repoData.length === 0) {
    return [];
  }

  const repoNames = repoData.map((repo) => repo.name);
  return repoNames.filter((repoName: string) => repoName.startsWith('mach-'));
};

/**
 * It takes an array of repo names, and returns an array of repo names that are accessible by the user
 * @param {string[]} repoNames - An array of repo names to check for access
 * @returns An array of repo names that are accessible
 */
export const accessibleRepos = async (repoNames: string[]) => {
  const accessibleRepos = [];

  for (const repoName of repoNames) {
    try {
      await request('GET /repos/{owner}/{repo}', {
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
