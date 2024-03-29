import { request } from '@octokit/request';

import chalk from 'chalk';

import { env } from './env/env';
import ProgressBar from './utils/progress-bar';

const log = console.log;

interface Repo {
  name: string;
}

/**
 * It gets the number of pages of repositories in the GitHub organization
 * @returns The number of pages of repositories in the GitHub organization.
 */
export const getPages = async (org: string) => {
  const response = await request('GET /orgs/{org}/repos', {
    org: org,
    headers: {
      authorization: `token ${env.GITHUB_TOKEN}`,
    },
    per_page: 100,
  });

  const link = response.headers.link;
  if (!link) {
    return 1;
  }

  const pages = link.split(',').find((item) => item.includes('rel="last"'));
  if (!pages) {
    return 1;
  }

  const lastPage = pages.split(';')[0];
  const lastPageNumber = lastPage.split('&page=')[1].split('>')[0];
  return Number(lastPageNumber);
};

/**
 * It makes a request to the GitHub API to get a list of all the repositories in the organization, and
 * returns an array of the names of those repositories
 * @param {number} pages - number - The number of pages of repositories to fetch.
 * @returns An array of strings
 */
export const getAllRepositories = async (pages: number, org: string): Promise<string[]> => {
  const repos: string[] = [];

  const bar = new ProgressBar('👑 Fetching repositories 👑');

  const totalRequests = pages;
  bar.init(totalRequests);

  for (let page = 1; page <= pages; page++) {
    const response = await request('GET /orgs/{org}/repos', {
      org: org,
      headers: {
        authorization: `token ${env.GITHUB_TOKEN}`,
      },
      per_page: 100,
      page,
    });

    const repoData = response.data;
    if (!Array.isArray(repoData) || repoData.length === 0) {
      return [];
    }

    repos.push(...repoData.map((repo: Repo) => repo.name));
    bar.update(page);
  }

  return repos;
};

/**
 * It takes an array of repo names, and returns an array of repo names that are accessible by the user
 * @param {string[]} repoNames - An array of repo names to check for access
 * @returns An array of repo names that are accessible
 */
export const accessibleRepos = async (repoNames: string[], org: string) => {
  const accessibleRepos: string[] = [];

  const bar = new ProgressBar('🛫 Checking for access 🛫');

  bar.init(repoNames.length);

  for (const repoName of repoNames) {
    try {
      await request('GET /repos/{owner}/{repo}', {
        owner: org,
        repo: repoName,
        headers: {
          authorization: `token ${env.GITHUB_TOKEN}`,
        },
      });
      accessibleRepos.push(repoName);
    } catch (error) {
      log(chalk.red(`❌ ${repoName} is not accessible`));
    }
    bar.update(accessibleRepos.length);
  }

  log('');
  log(chalk.green(`✅ ${accessibleRepos.length} accessible repos.`));
  log(chalk.red(`❌ ${repoNames.length - accessibleRepos.length} inaccessible repos`));
  log(chalk.blue.bold('🚀 List of repos 🚀'));
  log(accessibleRepos.map((repoName) => chalk.green(`✅ ${repoName}`)).join('\n'));

  return accessibleRepos;
};
