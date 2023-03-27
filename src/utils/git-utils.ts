import { cloneRepositories } from '../clone-repositories';
import { getRepositoriesList } from '../get-repositories';
import { repoStatus } from '../repo-status';

/**
 * It gets a list of repositories from a given organization and clones them into a given folder
 * @param {string} org - The organization name
 * @param {string} folder - The folder where you want to clone the repositories.
 */
export const getRepositoriesAndCloneIt = async (org: string, folder: string) => {
  const repos = await getRepositoriesList(org);
  await cloneRepositories(repos, org, folder);
};

/**
 * It gets a list of repositories from an organization, clones them, and then gets the status of each
 * repository
 * @param {string} org - The organization name
 * @param {string} folder - The folder where you want to clone the repositories to.
 */
export const getRepositoriesCloneItAndGetStatus = async (org: string, folder: string) => {
  const repos = await getRepositoriesList(org);
  await cloneRepositories(repos, org, folder);
  await repoStatus(repos, folder);
};

/**
 * It gets a list of repositories from the GitHub API, then it calls the repoStatus function for each
 * repository
 * @param {string} org - The name of the organization you want to get the repositories from.
 * @param {string} folder - The folder where you want to clone the repositories.
 */
export const getStatus = async (org: string, folder: string) => {
  const repos = await getRepositoriesList(org);
  await repoStatus(repos, folder);
};
