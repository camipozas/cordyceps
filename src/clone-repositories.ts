import simpleGit, { SimpleGit } from 'simple-git';
import chalk from 'chalk';
import path from 'path';

import fs from 'fs';

import { env } from './env/env';

const log = console.log;

/**
 * It clones a list of repositories into a local folder
 * @param {string[]} repoNames - An array of strings that represent the names of the repositories to
 * clone.
 */
export const cloneRepositories = async (repoNames: string[]) => {
  const git: SimpleGit = simpleGit();
  log(chalk.blue.bold('🚀 Cloning repositories 🚀'));

  for (const repoName of repoNames) {
    const repoUrl = `https://github.com/${env.GITHUB_ORG}/${repoName}`;
    const localPath = path.join(env.HOME, env.FOLDER, repoName);

    if (fs.existsSync(localPath)) {
      log(chalk.red(`❌ ${repoName} already exists in`) + chalk.yellow(` 📁 ${localPath}`));
    } else {
      await git.clone(repoUrl, localPath);
      log(chalk.green(`✅ Cloned ${repoName}`) + chalk.yellow(` 📁 ${localPath}`));
    }
  }
};
