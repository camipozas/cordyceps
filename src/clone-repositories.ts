import simpleGit, { SimpleGit } from 'simple-git';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';

const log = console.log;

/**
 * It clones a list of repositories into a local folder
 * @param {string[]} repoNames - An array of strings that represent the names of the repositories to
 * clone.
 * @param {Env} env - An object containing the environment variables.
 */
export const cloneRepositories = async (repoNames: string[], org: string, folder: string) => {
  const git: SimpleGit = simpleGit();

  let clonedRepos = 0;
  log(chalk.blue.bold('🚀 Cloning repositories 🚀'));

  for (const repoName of repoNames) {
    const repoUrl = `https://github.com/${org}/${repoName}`;
    const localPath = path.join(process.env.HOME ?? '', folder, repoName);

    if (fs.existsSync(localPath)) {
      log(chalk.red(`❌ ${repoName} already exists in`) + chalk.yellow(` 📁 ${localPath}`));
    } else {
      await git.clone(repoUrl, localPath);
      log(chalk.green(`✅ Cloned ${repoName}`) + chalk.yellow(` 📁 ${localPath}`));
    }
    clonedRepos++;
  }
  log(chalk.green(`📈 Successfully cloned ${clonedRepos}/${repoNames.length} repositories`));
};
