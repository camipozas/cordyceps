import chalk from 'chalk';
import path from 'path';
import simpleGit, { SimpleGit } from 'simple-git';

import { env } from './env/env';

const log = console.log;

/**
 * It checks the status of the local repository and pulls the latest changes if there are any
 * @param {string[]} repoNames - An array of repository names.
 */
export const repoStatus = async (repoNames: string[]) => {
  const git: SimpleGit = simpleGit();
  log(chalk.blue.bold('🚀 Checking repository status 🚀'));

  for (const repoName of repoNames) {
    const localPath = path.join(env.HOME, env.FOLDER, repoName);
    const status = await git.status();

    if (status.behind > 0) {
      try {
        await git.pull();
        log(chalk.green(`🐛 Pulled latest changes for ${repoName}`));
      } catch (error) {
        log(chalk.red(`❌ ${repoName} can't be pulled`));
      }
    }
  }
};
