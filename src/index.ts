import chalk from 'chalk';

import { getAllRepositories, accessibleRepos } from './get-repositories';
import { cloneRepositories } from './clone-repositories';
import { repoStatus } from './repo-status';

const main = async () => {
  const log = console.log;
  log(chalk.blue.bold('🚀 Create your own GitHub organization backup script 🚀'));
  const allRepos = await getAllRepositories();
  const accessible = await accessibleRepos(allRepos);
  await cloneRepositories(accessible);
  await repoStatus(accessible);
};

main();
