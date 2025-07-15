import chalk from 'chalk';
import path from 'path';
import simpleGit, { SimpleGit } from 'simple-git';

const log = console.log;

/**
 * It checks the status of the local repository and pulls the latest changes if there are any
 * @param {string[]} repoNames - An array of repository names.
 */
export const repoStatus = async (repoNames: string[], folder: string) => {
  const git: SimpleGit = simpleGit();
  log(chalk.blue.bold('🚀 Checking repository status 🚀'));

  for (const repoName of repoNames) {
    const repoPath = path.join(process.cwd(), folder, repoName);
    await git.cwd(repoPath);
    const { behind } = await git.status();

    if (behind === 0) {
      log(chalk.magenta(`🐛 ${repoName} is up to date`));
    } else {
      try {
        await git.pull();
        log(chalk.green(`🐛 Pulled latest changes for ${repoName}`));
      } catch (err) {
        const error = err as Error;
        log(chalk.red(`❌ ${repoName} can't be pulled`));
        log(chalk.gray(`Error: ${error.message}`));
      }
    }
  }
};
