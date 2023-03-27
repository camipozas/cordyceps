import chalk from 'chalk';

import { getPages, getAllRepositories, accessibleRepos } from './get-repositories';
import { cloneRepositories } from './clone-repositories';
import { repoStatus } from './repo-status';

export const main = async (org: string, folder: string, clone: boolean, status: boolean) => {
  console.log(chalk.blue.bold(`🚀 Getting repositories for ${org} 🚀`));
  const pages = await getPages(org);
  console.log(chalk.magenta.bold(`🚀 There are ${pages} pages of repositories 🚀`));
  const allRepos = await getAllRepositories(pages, org);
  const accessible = await accessibleRepos(allRepos, org);
  if (clone) {
    console.log(chalk.blue.bold('🚀 Cloning repositories 🚀'));
    await cloneRepositories(accessible, org, folder);
    if (status) {
      console.log(chalk.blue.bold('🚀 Checking repository status 🚀'));
      await repoStatus(accessible, folder);
    }
  }
};
