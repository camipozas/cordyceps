import simpleGit, { SimpleGit } from "simple-git";
import { env } from "./env/env";
import path from "path";

/**
 * It clones a list of repositories into a local folder
 * @param {string[]} repoNames - An array of strings that represent the names of the repositories to
 * clone.
 */
export const cloneRepositories = async (repoNames: string[]) => {
  const git: SimpleGit = simpleGit();

  for (const repoName of repoNames) {
    const repoUrl = `https://github.com/${env.GITHUB_ORG}/${repoName}`;
    const localPath = path.join(env.HOME, env.FOLDER, repoName);

    await git.clone(repoUrl, localPath);
    console.log(`Cloned ${repoName} into ${localPath}`);
  }
};
