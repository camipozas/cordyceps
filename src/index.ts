import chalk from 'chalk';

import { getPages, getAllRepositories, accessibleRepos } from './get-repositories';
import { cloneRepositories } from './clone-repositories';
import { repoStatus } from './repo-status';

/**
 * We get the number of pages of repositories, get all the repositories, filter out the ones we can't
 * access, clone the ones we can, and then check the status of the clones
 */
const main = async () => {
  const log = console.log;
  log(chalk.blue.bold('🚀 Create your own GitHub organization backup script 🚀'));
  const pages = await getPages();
  log(chalk.magenta.bold(`🚀 There are ${pages} pages of repositories 🚀`));
  const allRepos = await getAllRepositories(pages);
  const accessible = await accessibleRepos(allRepos);
  await cloneRepositories(accessible);
  await repoStatus(accessible);
};

main();
